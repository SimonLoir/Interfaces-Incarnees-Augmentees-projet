import style from '@style/3d.module.scss';
const host = process.env.NEXT_PUBLIC_SERVER_HOST || 'localhost';
const port = process.env.NEXT_PUBLIC_SERVER_PORT || '3001';
export default function Object3D() {
    return (
        <iframe
            className={style.frame}
            src={`http://${host}:${port}/3d`}
        ></iframe>
    );
}
