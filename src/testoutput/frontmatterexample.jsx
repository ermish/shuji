export const Frontmatterexample = () => { 
 
	const [shuji, setShuji] = useContext('ShujiContext')

	setMetadata({
		...shuji,
		date = '2021-01-01', 
		title = 'node with react and redux', 
		slug = 'node-react-redux', 
		description = 'How to node with react and redux', 
		tags = ['node','react','redux'], 

	})

    return (
        <div className='frontmatterexample'>
            <h1>Node with react redux</h1>
			<h2>test</h2>
			<p>This with a test with yaml front matter.			
			Node react stuffs</p>
			<h3>Reasons to use this</h3>
			<ul>
			<li>It&#x27;s awesome</li>
			<li>It&#x27;s lightweight</li>
			<li>It doesn&#x27;t replace your build pipeline.</li>
			</ul>
			<h4>The end</h4>
        </div>
    )
}