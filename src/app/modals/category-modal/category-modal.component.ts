import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, ModalController } from '@ionic/angular';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, ɵInternalFormsSharedModule } from '@angular/forms';
import { CategoryService } from 'src/app/services/category/category-service';
import { categoryModel } from 'src/app/models/category/categoryModel';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-category-modal',
  templateUrl: './category-modal.component.html',
  styleUrls: ['./category-modal.component.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, ɵInternalFormsSharedModule, ReactiveFormsModule]
})
export class CategoryModalComponent implements OnInit {

  @Input() categoryData?: categoryModel;

  public category: {id: number, name:string}[]=[]

  get getterForm(): FormGroup{
    return this.categoryForm;
 }
 
 get getterId(): number {

   this.category = this.categoryService.getCategories();

    const id = this.category.length
    ? Math.max(...this.category.map(t => t.id)) + 1
    : 1;

  return id;
 }

 public categoryForm!: FormGroup;
 
  constructor(
    private readonly modalCtrl: ModalController, 
    private readonly formBuilder: FormBuilder, 
    private readonly categoryService: CategoryService) {
      this.categoryForm = this.formBuilder.group({
        id:[null],
        name:['', Validators.required]
      })
    }

  ngOnInit() {
    if (this.categoryData) {
      this.categoryForm.patchValue({
        id: this.categoryData.id,
        name: this.categoryData.name
      });
    }
  }

  dismiss() {
    this.modalCtrl.dismiss();
  }

  public saveCategory(): void {

     const {name} = this.getterForm.controls;

     const duplicateCategory = this.categoryService.getCategories().some(c =>
  c.name.trim().toLowerCase() === name.value.trim().toLowerCase()
);
     

     if(!duplicateCategory){
        if (this.categoryForm.valid) {
          if (this.categoryData) {
            const category: categoryModel = {
              id: this.categoryData.id,
              name: name.value
            };
            this.categoryService.updateCategory(category);
            this.modalCtrl.dismiss({ categoryUpdated: true });
            Swal.fire({
              icon: 'success',
              title: 'Éxito',
              text: 'La categoría fue actualizada con éxito',
              toast: true,
              timer: 2500,
              showConfirmButton:false
            });
          } else {
            const category: categoryModel = {
              id: this.getterId,
              name: name.value
            };
      
            this.categoryService.addCategory(category);
            this.modalCtrl.dismiss({ categoryAdded: true });
            Swal.fire({
              icon: 'success',
              title: 'Éxito',
              text: 'La categoría fue guardada con éxito',
              toast: true,
              timer: 2500,
              showConfirmButton:false
            });
          }
        }else {
            Swal.fire({
              icon: 'warning',
              title: 'Campo requerido',
              text: 'El nombre de la categoria es obligatorio',
              toast: true,
              timer: 2500,
               showConfirmButton:false
            });
        }
     }else{
      Swal.fire({
        icon: 'warning',
        title: 'Categoría ya existe',
        text: 'Esta categoría ya ha sido creada anteriormente',
        toast: true,
        timer: 2500,
        showConfirmButton: false,
      });
     }
    

  }

  public deleteCategory(): void {
    if (this.categoryData) {
      this.categoryService.deleteCategory(this.categoryData.id);
      this.modalCtrl.dismiss({ categoryDeleted: true });
      Swal.fire({
        icon: 'success',
        title: 'Éxito',
        text: 'La categoría fue eliminada',
        toast: true,
        timer: 2500,
        showConfirmButton:false
      });
    }
  }
}
