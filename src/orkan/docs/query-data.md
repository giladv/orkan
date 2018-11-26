In Orkan.js there are 3 ways of accessing your data.

1. ### Value, WithValue, List and Collection
	The data components are the easies way to acces your data, simply set the path to listen to
	and what to render when it's ready. 
	
	here are a few examples:
	
	```jsx
    const Header = () => 
        <div className='Header'>
            <Value path='objects/header/title' />
        </div> 
	```
	
	```jsx
    const MainMenu = () => 
        <ul className='MainMenu'>
            <List path='objects/mainMenu/items' renderItem={(item, i) => 
                <li key={i}><a href={item.href}>{item.label}</a></li>
            }/>
        </ul> 
	```
	
	```jsx
    class Blog extends Component{
        render(){
            return (
                <div className='Blog'>
                    <h2 className='Blog-title'><Value path='objects/blog/title'/></h2>
                    <ul className='Blog-posts'>
                        <Collection path='blogPosts' where={{status: {'==': 'published'}}} renderItem={(post, id) => 
                            <li key={id}>
                                <h3>{post.title}</h3>
                                <p>{post.body}</p>        
                            </li>
                        }/>
                    </ul>
                </div>
            );
        }
    }
	```
2. ### Higher order component aka injection
	If you need the data in React's lifecycle functions, you can inject them directly to your component as props.
	here is how you do it:
	```jsx
    @inject(props => ({
        posts: {path: 'blogPosts', where: {status: {'==': 'published'}}}, // for collections only!
        title: 'objects/blog/title' // for documents / primitives
    }))
    class Blog extends PureComponent{
        render(){
            const {posts, title, isPathLoading} = this.props;
            
            if(isPathLoading.posts || isPathLoading.title){
                return <Spinner/>;
            }
            
            return (
                <div className='Blog'>
                    <h2>{title}</h2>
                    <ul>
                        {posts.map(post => (
                            <li key={post.$key}>
                                <h3>{post.title}</h3>
                                <p>{post.body}</p>
                            </li>
                        ))}
                    </ul>
                </div>
            );
        }
    }
	```
	
3. ### Store API
	The store provides access to the lowest level api available. for those really custom jobs.
	The complete api can be found [in the API section](docs/api/Firestore), but here are a few examples:
	```jsx
    @inject()
    @observer
    class Blog extends PureComponent{
        componentWillMount(){
            this.destructables = [
                store.listen('objects/blog/title'),
                store.listen('blogPosts', {where: {status: {'==': 'published'}}})
            ];
        }
        
        componentWillUnmount(){
            this.destructables.forEach(destroy => destroy());
        }
        
        render(){
            const {store} = this.props;
            
            if(store.isLoading('objects/blog/title') || store.isLoading('blogPosts')){
                return <Spinner/>;
            }
            
            return (
                <div className='Blog'>
                    <h2>{store.getValue('objects/blog/title')}</h2>
                    <ul>
                        {store.getValue('blogPosts').map(post => (
                            <li key={post.$key}>
                                <h3>{post.title}</h3>
                                <p>{post.body}</p>
                            </li>
                        ))}
                    </ul>
                </div>
            );
        }
    }
	
	```
	__* Notice the Mobx @observer decorator, the store is observable so we need to make sure our component will re-render on changes.__