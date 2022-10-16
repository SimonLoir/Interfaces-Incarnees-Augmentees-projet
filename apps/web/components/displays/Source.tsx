import style from '@style/DisplayChooser.module.scss';
export default function Source({
    source,
    selected = false,
}: {
    source: VideoSource;
    selected?: boolean;
}) {
    console.log(selected);
    return (
        <div
            className={
                style.source + ' ' + (selected ? style.selected : style.other)
            }
        >
            <img src={source.thumbnail} alt='' />
            <div>{source.name.slice(0, 30)}</div>
        </div>
    );
}
