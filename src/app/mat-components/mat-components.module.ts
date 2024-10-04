import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// added imports
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatMenuModule } from '@angular/material/menu';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatInput, MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS, MatFormFieldModule } from '@angular/material/form-field';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatAccordion } from '@angular/material/expansion';

const MaterialComponents = [MatButtonModule,
	MatCardModule,
	MatMenuModule,
	MatIconModule,
	MatListModule,
	MatToolbarModule,
	MatFormFieldModule,
	MatInputModule,
	MatSelectModule,
	MatTooltipModule,
	MatTableModule,
	MatSortModule,
	MatDatepickerModule,
	MatNativeDateModule,
	MatExpansionModule,
	MatAccordion
];

@NgModule({
	declarations: [],
	providers: [
		{
			provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
			useValue: { appearance: 'fill' },
		},
	],
	imports: [CommonModule, ...MaterialComponents],
	exports: [...MaterialComponents],
})

export class MatComponentsModule { }
