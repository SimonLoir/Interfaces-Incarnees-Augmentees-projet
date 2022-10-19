import style from '@style/DisplayChooser.module.scss';
export default function Source({
    source,
    onClick,
    selected = false,
    
}: {
    source: VideoSource;
    selected?: boolean;
    onClick : () => void;
}) {
    
    return (
        <button onClick={onClick}
            className={
                style.source + ' ' + (selected ? style.selected : style.other)
            }
        >
            <img src={source.thumbnail} alt='' />
            <div>{source.name.slice(0, 30)}</div>
        </button>
    );
}
