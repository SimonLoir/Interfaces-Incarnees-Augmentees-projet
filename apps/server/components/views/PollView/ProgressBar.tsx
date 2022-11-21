import progressBar from '@style/ProgressBar.module.scss';
export default function ProgressBar({
    progress,
    forCount,
    against,
}: {
    progress: number;
    forCount: number;
    against: number;
}) {
    return (
        <>
            <span className={progressBar.outLabel}>Vrai</span>
            <div className={progressBar.main}>
                <div
                    className={progressBar.for}
                    style={{ width: `calc(${progress}% + 4px)` }}
                >
                    {forCount}
                </div>
                <div
                    className={progressBar.against}
                    style={{ width: `calc(${100 - progress}% - 4px)` }}
                >
                    {against}
                </div>
            </div>
            <span className={progressBar.outLabel}>Faux</span>
        </>
    );
}
