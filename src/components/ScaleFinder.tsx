import { Table, Tabs } from "@mantine/core";
import { Tonality, commonScales, rankingSimilarScales, stringsToNotes } from "../lib/scale.ts";
import type { Note } from "../lib/scale.ts";

export function ScaleFinder() {
  let inputNotes: Note[];
  try {
    inputNotes = stringsToNotes(["C", "D", "E", "F", "G", "A", "B"]);
  } catch (e) {
    return <>{e}</>; // TODO(@unblee): ちゃんとエラーハンドリングする
  }

  const ranking = rankingSimilarScales(commonScales, inputNotes);

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

function tableRowTemplate(scaleName: string, scaleNotes: Note[], similarity: number) {
  return (
    <Table.Tr key={scaleName}>
      <Table.Td>{scaleName}</Table.Td>
      <Table.Td>{scaleNotes[0]}</Table.Td>
      <Table.Td>{scaleNotes[1]}</Table.Td>
      <Table.Td>{scaleNotes[2]}</Table.Td>
      <Table.Td>{scaleNotes[3]}</Table.Td>
      <Table.Td>{scaleNotes[4]}</Table.Td>
      <Table.Td>{scaleNotes[5]}</Table.Td>
      <Table.Td>{scaleNotes[6]}</Table.Td>
      <Table.Td>{`${Math.trunc(Number(similarity) * 100)}%`}</Table.Td>
    </Table.Tr>
  );
}

function tableTemplate(rows: JSX.Element[]) {
  return (
    <Table highlightOnHover>
      <Table.Thead>
        <Table.Tr>
          <Table.Th>Scale Name</Table.Th>
          <Table.Th>Ⅰ</Table.Th>
          <Table.Th>Ⅱ</Table.Th>
          <Table.Th>Ⅲ</Table.Th>
          <Table.Th>Ⅳ</Table.Th>
          <Table.Th>Ⅴ</Table.Th>
          <Table.Th>Ⅵ</Table.Th>
          <Table.Th>Ⅶ</Table.Th>
          <Table.Th>Similarity</Table.Th>
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>{rows}</Table.Tbody>
    </Table>
  );
}
