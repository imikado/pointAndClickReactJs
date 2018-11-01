class Modal extends React.Component {

    render() {

        return (<div onClick={function() {
                EventBus.publish('Game.closeModal')
            }} className="modal" style={{
                display: this.props.messageDisplay
            }}>

            <div className="modal-content" style={{
                    border: '6px solid ' + this.props.messageBorderColor

                }}>
                <a className="close" href="#" onClick={function() {
                        EventBus.publish('Game.closeModal')
                    }}>&times;</a>
                <p className="myModalTxt">{this.props.message}</p>
            </div>

        </div>);

    }
}
