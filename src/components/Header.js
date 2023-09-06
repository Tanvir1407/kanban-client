import { CgMenuGridR ,CgProfile} from 'react-icons/cg';
import { MdCircleNotifications,MdOutlineHelp,MdSettings} from 'react-icons/md';
import{RiMenu3Fill} from 'react-icons/ri'

export default function Header() {
  return (
    <div>
        <div className='flex justify-between items-center bg-white shadow-md py-3 px-5'>
            
            <div> 
            {/*Header left section || Headline there */}
                <div className='flex items-center'>
                   <CgMenuGridR size={25} color='#00008c'/> <h1 className='text-[#1E2952] text-[20px] font-semibold ml-2'>Task Management Board</h1> 
                </div>          
            </div>
            
            <div> 
            {/*Header Right section || search bar, notification icon, help icon, settings icon, and profile icon there */}
                <div className='sm:flex items-center hidden '>
                    <input type="text" className='search-bar' placeholder='Search...'/>
                    <MdCircleNotifications className="icon-classes" size={25} />
                    <MdOutlineHelp className='icon-classes' size={25}/>
                    <MdSettings className='icon-classes' size={25}/>
                    <CgProfile className='icon-classes' size={25}/>
                </div>  
                <RiMenu3Fill size={25} className='sm:hidden'/>  
            </div>
            
        </div>
    </div>
  )
}
