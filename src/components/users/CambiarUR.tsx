import { useUserStore } from '../../store/user'
import type { Option } from '../../types'
import Select, {type SingleValue, type ActionMeta} from 'react-select'

type URProps = {
  options:Option[]
}

export default function CambiarUR({options}: URProps) {

    const {setUrSelected} = useUserStore()

    const selectedUR = (newValue: SingleValue<Option>, _actionMeta: ActionMeta<Option>) => {
      setUrSelected(newValue as Option)
    }
  return (
    
      <Select 
        placeholder='Seleccione la Unidad Responsable'
        options={options} 
        menuPortalTarget={document.body}
        styles={{
            menuPortal: base => ({ ...base, zIndex: 9999 }),
            control: (baseStyles, _state) => ({
                ...baseStyles,
                textAlign: 'left',
              })
          }}
        onChange={selectedUR}
      />
    
  )
}
