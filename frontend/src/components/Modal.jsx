import React, {forwardRef} from 'react'

const Modal = forwardRef(({submitButton, children}, ref) => {
  return (
    <dialog ref={ref}>
        {children}
        <form>
            {submitButton && <button onClick={submitButton.action}>{submitButton.title}</button>}
            <button type='submit' formMethod='dialog'>Cancel</button>
        </form>    
    </dialog>
  )
});

export default Modal;