import Link from 'next/link'

const LinkToSettings = ({rights,url,as,name}) => {
    if ( rights < 2 ) return null;

    return (
        <div className="link-wrap">
            <Link href={url} as={as}>
                <a className="LinkToSettings">
                    {( url =="/settings") ? <i className="material-icons">settings</i> : null }
                    {name}
                </a>
            </Link>
        </div>
    )
}

export default LinkToSettings