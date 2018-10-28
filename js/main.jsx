const oGlobal = {
    'roomToStart': '',
    'listVerbs': []
};

const basePath = "git/pointAndClickReactJs/";

ReactDOM.render(<BrowserRouter basename={basePath}>
    <div>
        <Route exact="exact" path="/" component={Intro}/>
        <Route path="/Intro" component={Intro}/>
        <Route path="/Game" component={Game}/>
    </div>
</BrowserRouter>, document.getElementById('root'));
