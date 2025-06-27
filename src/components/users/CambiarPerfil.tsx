import Select, {type SingleValue, type ActionMeta} from 'react-select'
import { useUserStore } from '../../store/user'
import type { Option } from '../../types'

type PerfilProps = {
  options:Option[]
}

export default function CambiarPerfil({options}: PerfilProps) {

  const {setPerfilSelected} = useUserStore()

  const selectedPerfil = (newValue: SingleValue<Option>, _actionMeta: ActionMeta<Option>) => {
    setPerfilSelected(newValue as Option)
  }

  return (
    
      <Select 
        placeholder='Seleccione el perfil'
        options={options} 
        menuPortalTarget={document.body}
        styles={{
            menuPortal: base => ({ ...base, zIndex: 9999 }),
            control: (baseStyles, _state) => ({
                ...baseStyles,
                textAlign: 'left',
              })
          }}
        onChange={selectedPerfil}
      />
    
  )
}
