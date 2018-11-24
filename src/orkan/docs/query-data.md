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
	If you need the data in the react's lifecycle functions, you can inject them directly with ease.
	here are a few examples:
	
3. ### Store API
	The store provides access to the lowest level api available. for those really custom jobs.
	The complete api can be found [in the API section](docs/api/Firestore), but here are a few examples:
	