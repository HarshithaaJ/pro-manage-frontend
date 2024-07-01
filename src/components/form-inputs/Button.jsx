import {ThreeDots} from 'react-loader-spinner'

function Button({
    children,
    type='button',
    processing=false,
    ...props
}) {
  return (
    <button className='aqua-fill-button' disabled={processing} type={type} {...props} style={{display: "flex", justifyContent: "center"}}>
      {!processing ?
         children  : <ThreeDots
          height="18.65"
          color="white"
          ariaLabel="three-dots-loading"
          wrapperStyle={{}}
          wrapperClassName=""
          visible={true}
        />}
    </button>
  )
}

export default Button