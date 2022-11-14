import style from '@style/Home.module.scss';

export default function HomeScreenView() {
    return (
        <div className={style.main}>
            <h1>IronProf Client</h1>
            <p>
                Bienvenue sur le client IronProf. <br /> Votre affichage sera
                automatiquement synchronisé avec l&apos;affichage du professeur
                !
            </p>
        </div>
    );
}
