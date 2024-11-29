import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { VendorHomeComponent } from './vendor/vendor-home/vendor-home.component';
import { ProductHomeComponent } from './product/product-home/product-home.component';
import { GeneratorComponent } from './generator/generator/generator.component';
import { ViewerComponent } from './viewer/viewer.component';

const routes: Routes = [
	{ path: 'home', component: HomeComponent, title: 'Casestudy - Home' },
  { path: '', component: HomeComponent, title: 'Casestudy - Home' },
	{ path: 'vendors', component: VendorHomeComponent, title: 'Casestudy - Vendors' },
	{ path: 'products', component: ProductHomeComponent, title: 'Casestudy - Products' },
	{ path: 'generator', component: GeneratorComponent, title: 'Casestudy - Generator' },
	{ path: 'viewer', component: ViewerComponent, title: 'Casestudy - Viewer' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }
