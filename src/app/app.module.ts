import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideHttpClient, withFetch } from '@angular/common/http';

// modules
import { AppRoutingModule } from './app-routing.module';
import { MatComponentsModule } from './mat-components/mat-components.module';

// components
import { AppComponent } from './app.component';


@NgModule({
	declarations: [
		AppComponent
	],
	imports: [
		BrowserModule,
		AppRoutingModule,
		BrowserAnimationsModule,
		MatComponentsModule
	],
	providers: [
		provideClientHydration(),
		provideAnimationsAsync(),
		provideHttpClient(withFetch())
	],
	bootstrap: [AppComponent]
})
export class AppModule { }
