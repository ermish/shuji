export const Frontmatterexample = () => { 
	 TestContext.date = '2021-01-01' 
	 TestContext.title = 'node with react and redux' 
	 TestContext.slug = 'node-react-redux' 
	 TestContext.description = 'How to node with react and redux' 
	 TestContext.tags = ['node','react','redux'] 

    return ( 
        <div className='frontmatterexample'>
            <h1>Node with react redux</h1><h2>test</h2><p>This with a test with yaml front matter.
Node react stuffs</p><h3>Reasons to use this</h3><ul><li>It&#x27;s awesome</li><li>It&#x27;s lightweight</li><li>It doesn&#x27;t replace your build pipeline.</li></ul><h4>The end</h4>
        </div>
    )
}