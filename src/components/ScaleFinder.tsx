import { Button, Center, Group, Stack, Table, Tabs, Text, rem } from "@mantine/core";
import type { MantineColor } from "@mantine/core";
import { Dropzone } from "@mantine/dropzone";
import type { FileWithPath } from "@mantine/dropzone";
import { useMap } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import type { NotificationData } from "@mantine/notifications";
import { IconMusic, IconUpload, IconX } from "@tabler/icons-react";
import { parseArrayBuffer } from "midi-json-parser";
import type { IMidiFile } from "midi-json-parser-worker";
import { Note, Tonality, commonScales, rankingSimilarScales } from "../lib/scale.ts";

type NoteOn = {
  noteNumber: number;
  velociry: number;
};

type SelectedNoteMap = Map<Note, boolean>;

function isMIDINoteNumber(num: number): boolean {
  return 0 <= num && num <= 127 && Number.isInteger(num);
}

function noteNumbersToNotes(nums: number[]): Note[] {
  return nums.map((num) => {
    if (!isMIDINoteNumber(num)) throw new Error(`${num} is invalid midi note number (required 0 <= num <= 127)`);
    switch (num % 12) {
      case 0:
        return Note.C;
      case 1:
        return Note.CsharpDflat;
      case 2:
        return Note.D;
      case 3:
        return Note.DsharpEflat;
      case 4:
        return Note.E;
      case 5:
        return Note.F;
      case 6:
        return Note.FsharpGflat;
      case 7:
        return Note.G;
      case 8:
        return Note.GsharpAflat;
      case 9:
        return Note.A;
      case 10:
        return Note.AsharpBflat;
      default:
        // 事前に数値範囲は絞ってるので分岐は列挙できるかつ
        // switch なので default を記述しないと undefined になってしまうので
        // 本当は case 11: にしたいが default にしている
        return Note.B;
    }
  });
}

async function extractNotesFromMIDIFiles(files: FileWithPath[]): Promise<Note[]> {
  let ret: Note[] = [];
  for (const fileWithPath of files) {
    const buf = await fileWithPath.arrayBuffer();
    let midi: IMidiFile;
    try {
      midi = await parseArrayBuffer(buf);
    } catch (e) {
      throw new Error(`failed to parse midi file ${fileWithPath.name}`, { cause: e });
    }

    let noteNumbers: number[] = [];
    for (const track of midi.tracks) {
      const notesArray = track.filter((event) => event.noteOn).flatMap((event) => (event.noteOn as NoteOn).noteNumber);
      noteNumbers = noteNumbers.concat(notesArray);
    }

    let notes: Note[];
    try {
      notes = noteNumbersToNotes(noteNumbers);
    } catch (e) {
      throw new Error("contained an invalid note number", { cause: e });
    }

    ret = ret.concat(notes);
  }

  return [...new Set(ret)];
}

function notifyData({
  color,
  title,
  message,
}: {
  color: MantineColor;
  title: string;
  message: string;
}): NotificationData {
  return { color, title, message, position: "bottom-center", autoClose: 5000 };
}

function notifyInfo({ title, message }: { title: string; message: string }) {
  notifications.show(notifyData({ color: "green", title, message }));
}

function notifyError({ title, message }: { title: string; message: string }) {
  notifications.show(notifyData({ color: "red", title, message }));
}

function clearSelectedNoteMap(selectedNoteMap: SelectedNoteMap) {
  notifyInfo({ title: "音符の選択", message: "全て解除しました" });
  for (const [note] of selectedNoteMap) {
    selectedNoteMap.set(note, false);
  }
}

function selectNotes(selectedNoteMap: SelectedNoteMap, notes: Note[]) {
  for (const note of notes) {
    selectedNoteMap.set(note, true);
  }
}

export function ScaleFinder() {
  const selectedNoteMap = useMap(
    Object.values(Note).map((note) => {
      return [note, false];
    }),
  );

  return (
    <Stack align="stretch" justify="flex-start" gap="xl">
      <Center>
        <Dropzone
          onDrop={async (files) => {
            let notes: Note[] = [];
            try {
              notes = await extractNotesFromMIDIFiles(files);
            } catch (e) {
              console.debug("failed to extract notes from MIDI files", e);
              notifyError({ title: "MIDI ファイルの読み込み", message: "失敗しました" });
            }
            clearSelectedNoteMap(selectedNoteMap);
            selectNotes(selectedNoteMap, notes);
            notifyInfo({ title: "MIDI ファイルの読み込み", message: "反映しました" });
          }}
          accept={["audio/midi"]}
          w={rem(1000)}
        >
          <Group justify="center" gap="xl" mih={220} style={{ pointerEvents: "none" }}>
            <Dropzone.Accept>
              <IconUpload
                style={{ width: rem(52), height: rem(52), color: "var(--mantine-color-blue-6)" }}
                stroke={1.5}
              />
            </Dropzone.Accept>
            <Dropzone.Reject>
              <IconX style={{ width: rem(52), height: rem(52), color: "var(--mantine-color-red-6)" }} stroke={1.5} />
            </Dropzone.Reject>
            <Dropzone.Idle>
              <IconMusic
                style={{ width: rem(52), height: rem(52), color: "var(--mantine-color-dimmed)" }}
                stroke={1.5}
              />
            </Dropzone.Idle>

            <div>
              <Text size="md">
                MIDI ファイルをドラッグ＆ドロップするかクリックしてファイルを選択してください
                <br />
                もしくは音符を選択してください
              </Text>
            </div>
          </Group>
        </Dropzone>
      </Center>
      <Center>
        <Button.Group>
          {Array.from(selectedNoteMap.entries()).map(([note, selected]) => {
            return (
              <Button
                key={note}
                w={rem(100)}
                onClick={() => {
                  selected ? selectedNoteMap.set(note, false) : selectedNoteMap.set(note, true);
                }}
                variant={selected ? "filled" : "default"}
                size="md"
              >
                {note}
              </Button>
            );
          })}
        </Button.Group>
      </Center>
      <Center>
        <Button size="sm" onClick={() => clearSelectedNoteMap(selectedNoteMap)}>
          選択解除
        </Button>
      </Center>
      {scaleTables(selectedNoteMap)}
    </Stack>
  );
}

function scaleTables(selectedNoteMap: SelectedNoteMap) {
  const selectedNotes = getSelectedNotes(selectedNoteMap);

  if (selectedNotes.length === 0) {
    return <Center>音符を選択してください</Center>;
  }

  const ranking = rankingSimilarScales(commonScales, selectedNotes);

  // Major Scale
  const rankingOnlyMajor = ranking.filter((v) => v.scale.tonality === Tonality.Major);
  const majorScaleTableRows = rankingOnlyMajor.map((el) =>
    tableRowTemplate(el.scale.name, el.scale.notes, el.similarity),
  );
  // NaturalMinor Scale
  const rankingOnlyNaturalMinor = ranking.filter((v) => v.scale.tonality === Tonality.NaturalMinor);
  const naturalMinorScaleTableRows = rankingOnlyNaturalMinor.map((el) =>
    tableRowTemplate(el.scale.name, el.scale.notes, el.similarity),
  );

  return (
    <Center>
      <Tabs defaultValue="major-scale" w={rem(1500)}>
        <Tabs.List>
          <Tabs.Tab value="major-scale">メジャースケール</Tabs.Tab>
          <Tabs.Tab value="natural-minor-scale">ナチュラルマイナースケール</Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="major-scale">{tableTemplate(majorScaleTableRows)}</Tabs.Panel>
        <Tabs.Panel value="natural-minor-scale">{tableTemplate(naturalMinorScaleTableRows)}</Tabs.Panel>
      </Tabs>
    </Center>
  );
}

function getSelectedNotes(selectedNoteMap: SelectedNoteMap) {
  const ret: Note[] = [];
  for (const [note, selected] of selectedNoteMap) {
    if (selected) ret.push(note);
  }
  return ret;
}

function tableRowTemplate(scaleName: string, scaleNotes: Note[], similarity: number) {
  return (
    <Table.Tr key={scaleName}>
      <Table.Td>{`${Math.trunc(Number(similarity) * 100)}%`}</Table.Td>
      <Table.Td>{scaleName}</Table.Td>
      <Table.Td>{scaleNotes[0]}</Table.Td>
      <Table.Td>{scaleNotes[1]}</Table.Td>
      <Table.Td>{scaleNotes[2]}</Table.Td>
      <Table.Td>{scaleNotes[3]}</Table.Td>
      <Table.Td>{scaleNotes[4]}</Table.Td>
      <Table.Td>{scaleNotes[5]}</Table.Td>
      <Table.Td>{scaleNotes[6]}</Table.Td>
    </Table.Tr>
  );
}

function tableTemplate(rows: JSX.Element[]) {
  return (
    <Table highlightOnHover>
      <Table.Thead>
        <Table.Tr>
          <Table.Th>類似度</Table.Th>
          <Table.Th w={rem(300)}>スケール名</Table.Th> {/* タブの切り替えで幅が変わって見た目が悪いので固定 */}
          <Table.Th>Ⅰ</Table.Th>
          <Table.Th>Ⅱ</Table.Th>
          <Table.Th>Ⅲ</Table.Th>
          <Table.Th>Ⅳ</Table.Th>
          <Table.Th>Ⅴ</Table.Th>
          <Table.Th>Ⅵ</Table.Th>
          <Table.Th>Ⅶ</Table.Th>
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>{rows}</Table.Tbody>
    </Table>
  );
}
