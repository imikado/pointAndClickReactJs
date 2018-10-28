class SvgImages extends React.Component {

    render() {

        return (<g>{
                this.props.tList.map((oImage) => <image style={{
                        cursor: 'pointer'
                    }} onClick={function() {
                        EventBus.publish('Game.selectItem', oImage.id)
                    }} key={oImage.id} className="clickable" x={oImage.x} y={oImage.y} opacity={oImage.opacity} href={oImage.src}/>)
            }</g>);
    }
}
