export default function HomePage() {
	return (
		<main>
			<section>Main Content</section>
      <div className="p-12 bg-surface-500">
        <p className="text-fg-light">Light Text</p>
        <p className="text-fg">Normal Text</p>
        <p className="text-fg-dark">Dark Text</p>
        
        <h2>Primary Colors</h2>
        <div className="flex">
          <div className="p-6 bg-primary-100">100</div>
          <div className="p-6 bg-primary-200">200</div>
          <div className="p-6 bg-primary-300">300</div>
          <div className="p-6 bg-primary-400">400</div>
          <div className="p-6 bg-primary-500">500</div>
          <div className="p-6 bg-primary-600">600</div>
        </div>

        <h2>Surface Colors</h2>
        <div className="flex">
          <div className="p-6 bg-surface-100">100</div>
          <div className="p-6 bg-surface-200">200</div>
          <div className="p-6 bg-surface-300">300</div>
          <div className="p-6 bg-surface-400">400</div>
          <div className="p-6 bg-surface-500">500</div>
          <div className="p-6 bg-surface-600">600</div>
        </div>
        
        <h2>Special Colors</h2>
        <div className="flex">
          <div className="p-6 bg-error">Error</div>
        </div>
      </div>
		</main>
	);
}
