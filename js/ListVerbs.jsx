class ListVerbs extends React.Component {

    isSelected(verb_) {
        if (verb_ == this.props.verbSelected) {
            return 'selected';
        }
        return '';
    }

    render() {
        return (<div className="verbs">

            {
                this.props.tList.map((verb) => <a href="#" onClick={function() {
                        EventBus.publish('Game.selectVerb', verb)
                    }} className={this.isSelected(verb)} key={verb}>{verb}</a>)
            }

        </div>);
    }
}
