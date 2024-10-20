import { Container, Table } from "@mantine/core";

const elements = [{ degreeName: "Ⅰ", chordName: "C" }];

export function DiatonicChords() {
  const rows = elements.map((element) => (
    <Table.Tr key={element.chordName}>
      <Table.Td>{element.degreeName}</Table.Td>
      <Table.Td>{element.chordName}</Table.Td>
      <Table.Td>aaa</Table.Td>
    </Table.Tr>
  ));
  return (
    <Container size="xl">
      <Table>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>ディグリーネーム</Table.Th>
            <Table.Th>コード名</Table.Th>
            <Table.Th>テンション</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>{rows}</Table.Tbody>
      </Table>
    </Container>
  );
}
