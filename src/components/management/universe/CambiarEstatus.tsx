import Select, {type SingleValue, type ActionMeta} from 'react-select'
import { useConflictStore } from '../../../store/conflict/conflictStore'
import { useCatalogStore } from '../../../store/catalogStore'
import type { Option } from '../../../types'

export default function CambiarEstatus() {
  const setEstatus = useConflictStore(state => state.setEstatus);
  const {getOptionsEstatus} = useCatalogStore();

  const selectedStatus = (newValue: SingleValue<Option>, _actionMeta: ActionMeta<Option>) => {
    setEstatus(newValue as Option)
  }

  return (
    <>
      <Select 
        placeholder='Seleccione el estatus'
        options={getOptionsEstatus()} 
        menuPortalTarget={document.body}
        styles={{
            menuPortal: base => ({ ...base, zIndex: 9999 }),
            control: (baseStyles, _state) => ({
                ...baseStyles,
                textAlign: 'left',
              })
          }}
          onChange={selectedStatus}
      />
    </>
  )
}
