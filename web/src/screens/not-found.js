/** @jsx jsx */
/** @jsxFrag React.Fragment */
import {jsx} from '@emotion/core'

import {Link} from '../components/misc'

function NotFoundScreen() {
  return (
    <div
      css={{
        // height: '100%',
        display: 'grid',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div>
        what... what are you doing here? <Link to="/">go back home</Link>
      </div>
    </div>
  )
}

export {NotFoundScreen}
