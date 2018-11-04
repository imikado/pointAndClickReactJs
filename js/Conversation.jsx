class Conversation extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            iStep: 0,
            buttonEnabled: true
        };

    }

    getConversation() {
        if (this.props.tMessage && this.props.tMessage[this.state.iStep]) {
            return this.props.tMessage[this.state.iStep][1];
        }
    }
    getAlignConversation() {
        if (this.props.tMessage && this.props.tMessage[this.state.iStep]) {
            if ("L" == this.props.tMessage[this.state.iStep][0]) {
                return 'left';
            } else {
                return 'right';
            }
        }
    }

    nextStep() {

        var iStepNext = this.state.iStep;

        iStepNext++;

        Debug.log('iStepNext:' + iStepNext + ' length : ' + this.props.tMessage.length);

        if ((iStepNext + 1) >= this.props.tMessage.length) {

            this.setState({iStep: iStepNext});
            this.setState({buttonEnabled: false});
            return;
        }

        this.setState({buttonEnabled: true});
        this.setState({iStep: iStepNext});
    }

    isButtonEnabled() {
        if (this.state.buttonEnabled) {
            return 'visible';
        } else {
            return 'hidden';
        }
    }

    closeFunction() {

        this.setState({iStep: 0, buttonEnabled: true});

        Debug.log('close fonction conversation');

        EventBus.publish('Game.closeConversation');

    }

    render() {

        return (<div className="modal" style={{
                display: this.props.conversationDisplay
            }}>

            <div className="modal-content" style={{
                    border: '6px solid #777'

                }}>
                <a className="close" href="#" onClick={this.closeFunction.bind(this)}>&times;</a>
                <p className="myModalTxt" style={{
                        textAlign: this.getAlignConversation()
                    }}>{this.getConversation()}</p>

                <p style={{
                        textAlign: 'right'
                    }}>
                    <button className="btn" style={{
                            visibility: this.isButtonEnabled()
                        }} onClick={this.nextStep.bind(this)}>
                        Suivant</button>
                </p>
            </div>
        </div>);
    }

}
