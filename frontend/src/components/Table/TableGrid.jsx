import TableCard from './TableCard'

export default function TableGrid({ tables, onTableClick, single }) {
  if (single) return <TableCard table={tables[0]} onClick={onTableClick} />
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
      {tables.map((table) => (
        <TableCard key={table.id} table={table} onClick={onTableClick} />
      ))}
    </div>
  )
}
