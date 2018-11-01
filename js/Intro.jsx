class Intro extends React.Component {

    constructor(props) {
        super(props);
        this.state = {

            background: '',
            width: '',
            height: '',
            text: ''
        };

        console.log('load Intro');

        this.loadData();

    }

    loadData() {
        console.log('loadData');

        var requestURL = './data/main.json';

        var oRequest = new XMLHttpRequest();
        oRequest.open('GET', requestURL, true);
        oRequest.responseType = 'json';
        oRequest.send();

        oRequest.oGame = this;

        oRequest.onload = function() {
            console.log('loaded');
            var oData = oRequest.response;

            this.oGame.processData(oData.intro);
        }
    }

    processData(oData) {
        console.log('processData Intro');

        this.setState({background: oData.background, width: oData.width, height: oData.height, text: oData.text.join('')});

    }

    render() {
        return (<NavLink to="/Game">
            <div className="intro" style={{
                    width: this.state.width,
                    height: this.state.height,
                    background: 'url(' + this.state.background + ') bottom no-repeat'
                }} dangerouslySetInnerHTML={{
                    __html: this.state.text
                }}></div>
        </NavLink>);
    }

}
