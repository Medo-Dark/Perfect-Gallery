import { Component ,OnInit} from '@angular/core';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import {ImagesService} from "../Services/image.service";
import {ThemeService} from "../Services/theme.service";
import {SignInService} from "../Services/signin.service";
import { initFlowbite } from 'flowbite';

@Injectable({
  providedIn: 'root'
})
export class ImageService {
  images: Image[] = [];

  addImage(image: Image): void {
    this.images.push(image);
  }

  deleteImage(image: Image): void {
    this.images = this.images.filter(i => i !== image);
  }

  // Add more methods as needed
}

interface Image {
  id:string
  src: string;
  alt: string;
  themeId:string;
  selected: boolean;
}

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.css']
})
export class MainPageComponent {
  constructor(private router: Router,private SignIn:SignInService,private ImageSrv :ImagesService,private ThemeSrv:ThemeService) { }

  images: Image[] = [];
  themes:any[]=[];
  user:any = null;
  selectedImage: Image | null = null;
  isEditing: boolean = false;
  croppedImage: string | null = null;
  sidebarVisible1: boolean = true;

  ngOnInit(){
    this.user = this.SignIn.getUserData();
    initFlowbite();

    if(!this.user){
      this.router.navigate(['/']);
    }


    this.ThemeSrv.getUserThemes(this.user._id).subscribe((themes :any)=>{
      this.ThemeSrv.themes=themes;
      this.themes=themes;

      console.log(this.ThemeSrv.themes,"---------THEME111-----");
    });
    this.ImageSrv.getUserImages(this.user._id).subscribe((Imgs:any)=>{
      for(let img of Imgs){
        this.images.push({id:img._id,src: img.src, alt: img.Name, selected: false,themeId:this.themes[0]._id})
      }
    })
  }
  onFileSelected(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    if (inputElement.files && inputElement.files.length > 0) {
      const file = inputElement.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        const img = reader.result as string ;
        this.ImageSrv.SaveImage(this.ThemeSrv.themes[0]._id,this.user._id,file.name,img).subscribe((result :any) => {
          console.log(result,"SUCCESSES")
          this.images.push({ id:result._id,src: reader.result as string, alt: file.name, selected: false,themeId:this.themes[0]._id });
        },(error)=>{
          console.log(error,"ERROR")
        })

      };
      reader.readAsDataURL(file);
    }


  }

  deleteSelectedImages(img:Image): void {
    this.images = this.images.filter(image =>  image.id!=img.id);
    this.ImageSrv.deleteImage(img.id).subscribe();
  }
  toggleImageSelection(image: Image): void {
    image.selected = !image.selected;
  }
  downloadImage(image: Image): void {
    const link = document.createElement('a');
    link.href = image.src; // Set the image URL as the download link
    link.download = 'image.png'; // Set the default download filename (you can customize this if needed)
    link.click(); // Programmatically trigger the download
  }
  editImage(imageSrc: string,image:Image): void {
    console.log(image.themeId,"IN EDIT")
    this.router.navigate(['/custom', { src: imageSrc , ImageId:image.id , alt:image.alt,themeId:image.themeId }]);
  }

  logout(){
    localStorage.removeItem('user');
    this.router.navigate(['/']);
  }







}

