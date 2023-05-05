import { Component, OnInit } from '@angular/core';
import { Employee } from './model/employee';
import { EmployeeService } from './services/employee.service';
import { HttpErrorResponse } from '@angular/common/http';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  public employees!: Employee[]
  public editEmployee!: Employee;
  public deleteEmployee!: Employee

  constructor(private employeeService: EmployeeService) { }

  ngOnInit(): void {
    this.getEmployees()    
  }

  public getEmployees(): void {
    this.employeeService.getEmployees().subscribe({
      next: (res: Employee[]) => {
        this.employees = res
      },
      error: (error: HttpErrorResponse) => {
        alert(error.message)
      },
      complete: () => {
        console.log("Completed..")
      }
    })
  }

  // handling data from form for adding employee
  public onAddEmployee(addForm: NgForm): void {
    document.getElementById('add-employee-form')?.click()
    this.employeeService.addEmployee(addForm.value).subscribe({
      next: (res: Employee) => {
        console.log(res)
        this.getEmployees()
        addForm.reset()     
      },
      error: (err: HttpErrorResponse) => {
        alert(err.message)
        addForm.reset()
      }
    })
  }

  // for editing the employee
  public onUpdateEmployee(employee: Employee): void {
    this.employeeService.updateEmployee(employee).subscribe({
      next: (res: Employee) => {
        console.log(res)
        this.getEmployees()        
      },
      error: (err: HttpErrorResponse) => {
        alert(err.message)
      }
    })
  }

  // for deleting the employee
  public onDeleteEmployee(employeeId: number): void {
    this.employeeService.deleteEmployee(employeeId).subscribe({
      next: () => {
        this.getEmployees()
      },
      error: (err: HttpErrorResponse) => {
        alert(err.message)
      }
    })
  }

  // for searching employees
  public searchEmployees(key: string): void {
    const results: Employee[] = []
    for(const employee of this.employees) {
      if(employee.name.toLowerCase().indexOf(key.toLowerCase()) !== -1
      || employee.email.toLowerCase().indexOf(key.toLowerCase()) !== -1
      || employee.phone.toLowerCase().indexOf(key.toLowerCase()) !== -1 
      || employee.jobTitle.toLowerCase().indexOf(key.toLowerCase()) !== -1) {
        results.push(employee)
      }
    }
    this.employees = results
    if(results.length === 0 || !key) {
      this.getEmployees()
    }
  }

  // for modal interactions and other funtionalities
  public onOpenModal(employee: Employee, mode: string): void {
    const container = document.getElementById('main-container')
    const button = document.createElement('button')
    button.type = 'button'
    button.style.display = 'none'
    button.setAttribute('data-toggle', 'modal')

    if(mode === 'add') {
      button.setAttribute('data-target', '#addEmployeeModal')
    }
    if(mode === 'edit') {
      this.editEmployee = employee
      button.setAttribute('data-target', '#updateEmployeeModal')
    }
    if(mode === 'delete') {
      this.deleteEmployee = employee
      button.setAttribute('data-target', '#deleteEmployeeModal')
    }
    // appending the button to container div
    container?.appendChild(button)
    button.click()
  }

}
