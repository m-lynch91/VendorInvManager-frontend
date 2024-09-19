// how to reference other modules
import { Component } from '@angular/core';
import { Location } from '@angular/common';

// decorator - tells Angular we are building a component in typescript
@Component({
	selector: 'app-casestudy', // declares html tag that contains the app (i.e. <app-exercises></app-exercises>)
	templateUrl: './app.component.html', // specifies html to be used for component
	styleUrl: './app.component.scss', // specifies styling to be used for component (different than styles.scss which is site-wide)
})

// defines typescript class AppComponent
// export keyword indicates this module can be imported into other modules
export class AppComponent {
	title: string = '';

	constructor(private location: Location) {
		let path = location.path();

		if (path && path.length > 1) {
			let header = path.substring(1,2).toUpperCase();
			header += path.substring(2);
			this.setTitle(header);
		}
		else if (path === '') {
			this.setTitle('');
		}
	}

	setTitle(header: string) {
		this.title = header ? header : 'Home';
	}
}
