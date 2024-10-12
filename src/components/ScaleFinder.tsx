import { Button, Center, Stack, Table, Tabs, rem } from "@mantine/core";
import { useMap } from "@mantine/hooks";
import { Note, Tonality, commonScales, rankingSimilarScales } from "../lib/scale.ts";

export function ScaleFinder() {
  const selectedNoteMap = useMap(
    Object.values(Note).map((note) => {
      return [note, false];
    }),
  );

  return (
    <Stack align="stretch" justify="flex-start" gap="xl">
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
        <Button
          size="sm"
          onClick={() => {
            for (const [note] of selectedNoteMap) {
              selectedNoteMap.set(note, false);
            }
          }}
        >
          選択解除
        </Button>
      </Center>
      {scaleTables(Array.from(selectedNoteMap))}
    </Stack>
  );
}

function scaleTables(selectedNoteMap: [Note, boolean][]) {
  const selectedNotes = getSelectedNotes(selectedNoteMap);

  if (selectedNotes.length === 0) {
    return <Center>音符を入力してください</Center>;
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
    <Tabs defaultValue="major-scale">
      <Tabs.List>
        <Tabs.Tab value="major-scale">Major Scale</Tabs.Tab>
        <Tabs.Tab value="natural-minor-scale">Natural Minor Scale</Tabs.Tab>
      </Tabs.List>

      <Tabs.Panel value="major-scale">{tableTemplate(majorScaleTableRows)}</Tabs.Panel>
      <Tabs.Panel value="natural-minor-scale">{tableTemplate(naturalMinorScaleTableRows)}</Tabs.Panel>
    </Tabs>
  );
}

function getSelectedNotes(selectedNoteMap: [Note, boolean][]) {
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
          <Table.Th>Similarity</Table.Th>
          <Table.Th>Scale Name</Table.Th>
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
