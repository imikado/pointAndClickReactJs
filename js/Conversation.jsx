class Conversation extends React.Component {

    constructor(props) {
        super(props);

        this.iStep = 0;

        this.state = {
            iStep: this.iStep,
            buttonEnabled: true
        };

    }

    getConversation() {
        if (this.props.tMessage) {
            return this.props.tMessage[this.state.iStep][1];
        }
    }

    nextStep() {

        var iStepNext = this.state.iStep;

        iStepNext++;

        console.log('stePnet:' + iStepNext + ' length : ' + this.props.tMessage.length);

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
            return 'block';
        } else {
            return 'none';
        }
    }

    render() {

        return (<div className="modal" style={{
                display: this.props.conversationDisplay
            }}>

            <div className="modal-content">
                <a className="close" href="#" onClick={function() {
                        EventBus.publish('Game.closeConversation')
                    }}>&times;</a>
                <p className="myModalTxt">{this.getConversation()}</p>

                <p style={{
                        textAlign: 'right'
                    }}>
                    <button className="btn" style={{
                            display: this.isButtonEnabled()
                        }} onClick={this.nextStep.bind(this)}>
                        Next</button>
                </p>
            </div>
        </div>);
    }

}
