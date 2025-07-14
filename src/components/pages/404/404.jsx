import ErrorMessage from "../../errorMessage/ErrorMessage.jsx";
import {Link} from "react-router-dom";

import "./404.scss"

const Page404 = () => {
  return (
      <div>
        <ErrorMessage/>
        <p className="error__message">Page doesn't exist</p>
        <Link className="error__message-back" to="/">Back to main page</Link>
      </div>
  )
}

export default Page404;