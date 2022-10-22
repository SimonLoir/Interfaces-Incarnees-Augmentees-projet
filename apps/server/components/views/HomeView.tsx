import style from '@style/HomeView.module.scss';

export default function HomeView() {
    return (
        <div className={style.main}>
            <img src={'/logo.png'} alt='logo' className={style.image} />
        </div>
    );
}
