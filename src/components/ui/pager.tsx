import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

type PagerProps = {
  pageSize: number
  setPageSize: (pageSize: number) => void
  disabled?: boolean
}

const PAGE_SIZE = [10, 20, 30, 40, 50]

const Pager: React.FC<PagerProps> = ({ pageSize, setPageSize, disabled = false }) => {
  return (
    <div className="flex items-center gap-2">
      <p>Rows per page</p>
      <Select onValueChange={(val) => setPageSize(Number(val))} defaultValue={pageSize.toString()} disabled={disabled}>
        <SelectTrigger data-size="sm" className="hover:bg-accent data-[state=open]:bg-accent">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {PAGE_SIZE.map((size) => (
            <SelectItem key={size} value={size.toString()}>
              {size}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}

export default Pager
