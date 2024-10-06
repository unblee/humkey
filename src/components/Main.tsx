import { Table } from "@mantine/core";

const data = [
  { name: "C", key: "C", tonality: "major", Ⅰ: "C", Ⅱ: "D", Ⅲ: "E", Ⅳ: "F", Ⅴ: "G", Ⅵ: "A", Ⅶ: "B" },
  { name: "D", key: "D", tonality: "major", Ⅰ: "D", Ⅱ: "E", Ⅲ: "F#", Ⅳ: "G", Ⅴ: "A", Ⅵ: "B", Ⅶ: "C#" },
  { name: "E", key: "E", tonality: "major", Ⅰ: "E", Ⅱ: "F#", Ⅲ: "G#", Ⅳ: "A", Ⅴ: "B", Ⅵ: "C#", Ⅶ: "D#" },
  { name: "F", key: "F", tonality: "major", Ⅰ: "F", Ⅱ: "G", Ⅲ: "A", Ⅳ: "B♭", Ⅴ: "C", Ⅵ: "D", Ⅶ: "E" },
  { name: "G", key: "G", tonality: "major", Ⅰ: "G", Ⅱ: "A", Ⅲ: "B", Ⅳ: "C", Ⅴ: "D", Ⅵ: "E", Ⅶ: "F#" },
  { name: "A", key: "A", tonality: "major", Ⅰ: "A", Ⅱ: "B", Ⅲ: "C#", Ⅳ: "D", Ⅴ: "E", Ⅵ: "F#", Ⅶ: "G#" },
  { name: "B", key: "B", tonality: "major", Ⅰ: "B", Ⅱ: "C#", Ⅲ: "D#", Ⅳ: "E", Ⅴ: "F#", Ⅵ: "G#", Ⅶ: "A#" },
  { name: "D♭", key: "D♭", tonality: "major", Ⅰ: "D♭", Ⅱ: "E♭", Ⅲ: "F", Ⅳ: "G♭", Ⅴ: "A♭", Ⅵ: "B♭", Ⅶ: "C" },
  { name: "E♭", key: "E♭", tonality: "major", Ⅰ: "E♭", Ⅱ: "F", Ⅲ: "G", Ⅳ: "A♭", Ⅴ: "B♭", Ⅵ: "C", Ⅶ: "D" },
  { name: "G♭", key: "G♭", tonality: "major", Ⅰ: "G♭", Ⅱ: "A♭", Ⅲ: "B♭", Ⅳ: "C♭(B)", Ⅴ: "D♭", Ⅵ: "E♭", Ⅶ: "F" },
  { name: "A♭", key: "A♭", tonality: "major", Ⅰ: "A♭", Ⅱ: "B♭", Ⅲ: "C", Ⅳ: "D♭", Ⅴ: "E♭", Ⅵ: "F", Ⅶ: "G" },
  { name: "B♭", key: "B♭", tonality: "major", Ⅰ: "B♭", Ⅱ: "C", Ⅲ: "D", Ⅳ: "E♭", Ⅴ: "F", Ⅵ: "G", Ⅶ: "A" },
];

export function Main() {
  const rows = data.map((element) => (
    <Table.Tr key={element.name}>
      <Table.Td>{element.key}</Table.Td>
      <Table.Td>{element.tonality}</Table.Td>
      <Table.Td>{element.Ⅰ}</Table.Td>
      <Table.Td>{element.Ⅱ}</Table.Td>
      <Table.Td>{element.Ⅲ}</Table.Td>
      <Table.Td>{element.Ⅳ}</Table.Td>
      <Table.Td>{element.Ⅴ}</Table.Td>
      <Table.Td>{element.Ⅵ}</Table.Td>
      <Table.Td>{element.Ⅶ}</Table.Td>
    </Table.Tr>
  ));

  return (
    <Table highlightOnHover>
      <Table.Thead>
        <Table.Tr>
          <Table.Th>Key</Table.Th>
          <Table.Th>Tonality</Table.Th>
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
