class ListInventory extends React.Component {

    isSelected(withId_) {
        if (withId_ == this.props.withSelected) {
            return 'selected';
        }
        return '';
    }

    render() {
        return (<div className="inventory">

            {
                this.props.tList.map((oWith, index) => <a href="#" onClick={function() {
                        EventBus.publish('Game.selectWith', oWith.id)
                    }} className={this.isSelected(oWith.id)} key={index}><img src={oWith.src}/></a>)
            }

        </div>);
    }
}
