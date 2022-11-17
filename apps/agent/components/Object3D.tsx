import style from '@style/3d.module.scss';
import { getServerInfo } from 'utils/network';
const { host, port } = getServerInfo();
export default function Object3D() {
    return (
        <iframe
            className={style.frame}
            src={`http://${host}:${port}/3d`}
        ></iframe>
    );
}
