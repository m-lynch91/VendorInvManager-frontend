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
import { HomeComponent } from './home/home.component';
import { VendorModule } from './vendor/vendor.module';


@NgModule({
	declarations: [
		AppComponent,
		HomeComponent
	],
	imports: [
		BrowserModule,
		AppRoutingModule,
		BrowserAnimationsModule,
		MatComponentsModule,
		VendorModule
	],
	providers: [
		provideClientHydration(),
		provideAnimationsAsync(),
		provideHttpClient(withFetch())
	],
	bootstrap: [AppComponent]
})
export class AppModule { }
