'use client'
import Spacing from "../Spacing/Spacing";
import { ImagesSectionValues, ProjectsSectionValues, ReviewsSectionValues, ServicesSectionValues, SocialMediaSectionValues } from "@/customWebsiteBuild";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { FacebookIcon, InstagramIcon, LinkedinIcon, TwitterIcon, XIcon, YoutubeIcon } from "lucide-react";
import { getOptionsForSelect } from "./cwbUtils";
import { CustomSelect } from "../Select/Select";
import { ProjectItem, ReviewItem, ServiceItem, SocialMediaLink, WebsiteConfig } from "@/websiteConfig";
import { pluralSuffixer, titleCase } from "@/lib/str";
import { TiktokIcon } from "../Icons/Icon";

type FormElementsProps = {
   formSetting: {
      key: any;
      name: string;
      type: "text" | "number" | "text-to-img" | "text-img-array" | "social-media" | "color" | "textarea" | "opening-times" | "text-array" |
         "select-links-style" | "select-cta-type" | "select-desktop-nav-style" | "select-footer-style" | "services-array" | "projects-array" | "reviews-array";
   }
   initialValue: any;
   updateValue: (key: any, newValue: any) => void;
}

export default function FormElement ({ formSetting, initialValue, updateValue }: FormElementsProps) {
   const props = { formSetting, initialValue, updateValue };

   if (formSetting.type == "text") {
      return <TextFormElement {...props} />
   } else if (formSetting.type == "number") {
      return <NumberFormElement {...props} />
   } else if (formSetting.type == "text-to-img") {
      return <TextToImgFormElement {...props} />
   } else if (formSetting.type == "text-img-array") {
      return <TextImgArrayFormElement {...props} />
   } else if (formSetting.type.startsWith("select")) {
      const selectOptions = getOptionsForSelect(formSetting.type);
      return <SelectFormElement {...props} options={selectOptions} />
   } else if (formSetting.type.startsWith("textarea")) {
      return <TextareaFormElement {...props} about={formSetting.type.includes("about")} />
   } else if (formSetting.type == "opening-times") {
      return <OpeningDaysFormElement {...props} />
   } else if (formSetting.type == "color") {
      return <ColorPickerFormElement {...props} />
   } else if (formSetting.type == "services-array") {
      return <ServicesArrayFormElement {...props} />
   } else if (formSetting.type == "projects-array") {
      return <ProjectsArrayFormElement {...props} />
   } else if (formSetting.type == "reviews-array") {
      return <ReviewsArrayFormElement {...props} />
   } else if (formSetting.type == "social-media") {
      return <SocialMediaArrayFormElement {...props} />
   }
   
}

function TextFormElement ({ formSetting, initialValue, updateValue }: FormElementsProps) {
   return (
      <div className="box full dfb column gap-5 mt-1">
         <div className="text-s full bold-500">{formSetting.name}</div>
         <input
            type="text" className="xxs pd-12 pdx-2 full mw-600"
            placeholder={formSetting.name}
            value={initialValue}
            onChange={e => updateValue(formSetting.key, e.target.value)}
         />
      </div>
   )
}

function NumberFormElement ({ formSetting, initialValue, updateValue }: FormElementsProps) {
   return (
      <div className="box full dfb column gap-5 mt-1">
         <div className="text-s full bold-500">{formSetting.name}</div>
         <input
            type="number" className="xxs pd-12 pdx-2 full mw-600"
            placeholder={formSetting.name}
            value={initialValue}
            onChange={e => updateValue(formSetting.key, parseInt(e.target.value.trim()))}
         />
      </div>
   )
}

function TextToImgFormElement ({ formSetting, initialValue, updateValue }: FormElementsProps) {
   const [imgUrl, setImgUrl] = useState<string>(initialValue);

   return (
      <div className="box full dfb column gap-5 mt-1">
         <div className="text-s full bold-500">{formSetting.name}</div>
         {imgUrl.trim() !== "" && (<div className="cwb-custom-image">
            <img src={imgUrl} alt="custom-image" />
         </div>)}
         <input
            type="text" className="xxs pd-12 pdx-2 full mw-600"
            placeholder={`${formSetting.name} Url`}
            value={initialValue}
            onChange={e => {
               setImgUrl(e.target.value)
               updateValue(formSetting.key, e.target.value);
            }}
         />
      </div>
   )
}

function TextImgArrayFormElement ({ formSetting, initialValue, updateValue }: FormElementsProps) {
   const [totalImages, setTotalImages] = useState<ImagesSectionValues>(initialValue);
   const [imgUrl, setImgUrl] = useState("");

   useEffect(() => updateValue(formSetting.key, totalImages), [totalImages])

   function addImage () {
      setTotalImages(p => ([ ...p, imgUrl ]));
      setImgUrl("");
      toast("Added image");
   }

   function removeImage (index: number) {
      setTotalImages(prev => ([ ...prev.filter((_, i) => i !== index) ]));
      toast("Removed image");
   }

   return (
      <div className="box full dfb column gap-5 mt-1">
         {imgUrl !== "" && (<div className="box full dfb column gap-5 pd-1">
            <div className="text-xxs pd-05 grey-5">Preview Image</div>
            <div className="cwb-custom-image">
               <img src={imgUrl} alt="custom-image" />
            </div>
         </div>)}

         <div className="text-xs full bold-500 mt-2">Add an image url</div>
         <div className="box full dfb align-center gap-10">
            <input
               type="text" className="xxs pd-12 pdx-2 full mw-600"
               placeholder={`${formSetting.name} Url`}
               value={imgUrl}
               onChange={e => setImgUrl(e.target.value)}
            />
            <button className="xxs pd-12 pdx-15" onClick={addImage}>Add</button>
         </div>

         <Spacing size={2} />
         {totalImages.length == 0 && (<div className="text-xxs grey-5">No Images Added</div>)}
         <div className="box full dfb wrap gap-10">
            {totalImages.map((image, index) => (
               <div key={index} className="cwb-custom-image-removable">
                  <div className="close" onClick={() => removeImage(index)}><XIcon size={20} strokeWidth={3} /></div>
                  <img src={image} alt="custom-image" />
               </div>
            ))}
         </div>
      </div>
   )
}

type SelectItem = { option: string | React.ReactNode; optionName: string; }
type SelectFormElementProps = FormElementsProps & { options: SelectItem[]; }
function SelectFormElement ({ formSetting, initialValue, updateValue, options }: SelectFormElementProps ) {
   const defaultOptionIndex = options.findIndex(option => option.optionName == initialValue);
   return (
      <div className="box full dfb column gap-5 mt-1">
         <div className="text-s full bold-500">{formSetting.name}</div>
         <div className="box full pd-1">
            <CustomSelect
               options={options} onSelect={(option) => updateValue(formSetting.key, option)}
               style={{ padding: "7px 7px", width: "100%", maxWidth: "340px" }}
               defaultOptionIndex={defaultOptionIndex}
            />
         </div>
      </div>
   )
}

type TextareaFormElementProps = FormElementsProps & { about: boolean; }
function TextareaFormElement ({ formSetting, initialValue, updateValue, about }: TextareaFormElementProps) {
   return (
      <div className="box full dfb column gap-10 mt-1">
         <div className="text-s full bold-500">{formSetting.name}</div>
         <textarea
            className="xxs pd-12 pdx-2 full mw-600 h-20 border-radius-15"
            placeholder={formSetting.name}
            value={about ? initialValue.join("\n") : initialValue}
            onChange={e => {
               const content = about ? e.target.value.split("\n") : e.target.value
               updateValue(formSetting.key, content)
            }}
         />
      </div>
   )
}

function OpeningDaysFormElement ({ formSetting, initialValue, updateValue }: FormElementsProps) {
   const [openingTimes, setOpeningTimes] = useState<WebsiteConfig['openingTimes']>(initialValue);

   useEffect(() => updateValue(formSetting.key, openingTimes), [openingTimes])

   return (
      <div className="box full dfb column gap-5 mt-1">
         <div className="text-s full bold-500">{formSetting.name}</div>
         {Object.keys(openingTimes).map((day: any) => (
            <div key={day} className="box full pd-1 dfb column gap-10">
               <div className="text-s full bold-500">{day}</div>
               <input
                  type="text" className="xxs pd-12 pdx-2 full mw-600"
                  placeholder={`${day} Opening Time`}
                  value={(openingTimes as any)[day]}
                  onChange={e => setOpeningTimes(p => ({ ...p, [day]: e.target.value }))}
               />
            </div>
         ))}
      </div>
   )
}

function ColorPickerFormElement ({ formSetting, initialValue, updateValue }: FormElementsProps) {
   const [color, setColor] = useState(initialValue);

   useEffect(() => updateValue(formSetting.key, color), [color]);

   return (
      <div className="box full dfb column gap-5 mt-1">
         <div className="text-s full bold-500">{formSetting.name}</div>
         <div className="picker-wrap">
            <label className="pill">
               <span className="swatch" style={{ backgroundColor: color }}>
                  <input
                     type="color"
                     value={color}
                     onChange={(e) => setColor(e.target.value)}
                     className="picker-input"
                     aria-label="Pick a color"
                  />
               </span>
               <span className="divider" />
               <span className="hex-value">{color.toUpperCase()}</span>
            </label>
         </div>
      </div>
      
   );
}

function ServicesArrayFormElement ({ formSetting, initialValue, updateValue }: FormElementsProps) {
   const [totalServices, setTotalServices] = useState<ServicesSectionValues>(initialValue);
   const [service, setService] = useState<ServiceItem>({
      id: "",
      name: "",
      shortDescription: "",
      description: "",
      images: []
   });
   const [serviceImgUrl, setServiceImgUrl] = useState("");

   function addServiceImage () {
      setService(p => ({ ...p, images: [ ...p.images, serviceImgUrl ] }));
      setServiceImgUrl("");
      toast("Added Service Image");
   }

   function removeServiceImage (index: number) {
      setService(prev => ({ ...prev, images: [ ...prev.images.filter((_, i) => i !== index) ] }));
      toast("Removed Service Image");
   }

   useEffect(() => updateValue(formSetting.key, totalServices), [totalServices])

   function addService () {
      if ([service.name, service.shortDescription, service.description].includes("")) {
         toast.error("Please enter information about the service");
         return;
      }
      if (service.images.length < 1) {
         toast.error("Service must have an image");
         return;
      }
      setTotalServices(p => ([ ...p, service ]));
      setService({
         id: "", name: "", shortDescription: "",
         description: "", images: []
      });
      toast("Added Service");
   }

   function removeService (index: number) {
      setTotalServices(prev => ([ ...prev.filter((_, i) => i !== index) ]));
      toast("Removed Service");
   }

   return (
      <div className="box full dfb column gap-5 mt-1">
         <div className="text-xs full bold-500">Add a Service</div>
         <div className="box full dfb column gap-10">
            <input
               type="text" className="xxs pd-12 pdx-2 full mw-600"
               placeholder="Service Name"
               value={service.name}
               onChange={e => {
                  setService(p => ({
                     ...p, name: e.target.value,
                     id: e.target.value.toLowerCase().replaceAll(" ", "-")
                  }))
               }}
            />
            <input
               type="text" className="xxs pd-12 pdx-2 full mw-600"
               placeholder="Short Description"
               value={service.shortDescription}
               onChange={e => setService(p => ({ ...p, shortDescription: e.target.value })) }
            />
            <textarea
               className="xxs pd-12 pdx-2 full mw-600 h-20 border-radius-15"
               placeholder="Description"
               value={service.description}
               onChange={e => setService(p => ({ ...p, description: e.target.value })) }
            />

            <div className="box full dfb wrap gap-10">
               {service.images.map((image, index) => (
                  <div key={index} className="cwb-custom-image-removable service-img">
                     <div className="close" onClick={() => removeServiceImage(index)}><XIcon size={20} strokeWidth={3} /></div>
                     <img src={image} alt="custom-image" />
                  </div>
               ))}
               {serviceImgUrl !== "" && (<div className="cwb-custom-image-removable service-img">
                  <img src={serviceImgUrl} alt="custom-image" />
               </div>)}
            </div>
            <div className="text-xs full bold-500 mt-2">Add an image url</div>
            <div className="box full dfb align-center gap-10">
               <input
                  type="text" className="xxs pd-12 pdx-2 full mw-600"
                  placeholder={"Service Image Url"}
                  value={serviceImgUrl}
                  onChange={e => setServiceImgUrl(e.target.value)}
               />
               <button className="xxs pd-12 pdx-15" onClick={addServiceImage}>Add</button>
            </div>
            <button className="xxs pd-12 pdx-3" onClick={addService}>Add Service</button>
         </div>

         <Spacing size={2} />
         {totalServices.length == 0 && (<div className="text-xxs grey-5">No Services Added</div>)}
         <div className="box full dfb wrap gap-10">
            {totalServices.map((service, index) => (
               <div key={index} className="cwb-custom-service-card">
                  <div className="cwb-custom-service-card-image">
                     <img src={service.images[0]} alt="first service image" />
                  </div>
                  <div className="cwb-custom-service-info">
                     <div className="text-xs full bold-600">{service.name}</div>
                     <div className="text-xxs full grey-5">{service.shortDescription}</div>
                     <div className="text-xxs full grey-5">{service.description}</div>
                     <div className="text-xxs full grey-5">{service.images.length} {pluralSuffixer('image', service.images.length, 's')}</div>
                     <button className="xxxxs pd-1 pdx-15 delete" onClick={() => removeService(index)}>Remove Service</button>
                  </div>
               </div>
            ))}
         </div>
      </div>
   )
}

function ProjectsArrayFormElement ({ formSetting, initialValue, updateValue }: FormElementsProps) {
   const [totalProjects, setTotalProjects] = useState<ProjectsSectionValues>(initialValue);
   const [project, setProject] = useState<ProjectItem>({
      id: "",
      name: "",
      description: "",
      images: []
   });
   const [projectImgUrl, setProjectImgUrl] = useState("");

   function addProjectImage () {
      setProject(p => ({ ...p, images: [ ...p.images, projectImgUrl ] }));
      setProjectImgUrl("");
      toast("Added Project Image");
   }

   function removeProjectImage (index: number) {
      setProject(prev => ({ ...prev, images: [ ...prev.images.filter((_, i) => i !== index) ] }));
      toast("Removed Project Image");
   }

   useEffect(() => updateValue(formSetting.key, totalProjects), [totalProjects])

   function addProject () {
      if ([project.name, project.description].includes("")) {
         toast.error("Please enter information about the project");
         return;
      }
      if (project.images.length < 1) {
         toast.error("Project must have an image");
         return;
      }
      setTotalProjects(p => ([ ...p!, project ]));
      setProject({ id: "", name: "", description: "", images: [] });
      toast("Added Project");
   }

   function removeProject (index: number) {
      setTotalProjects(prev => ([ ...prev!.filter((_, i) => i !== index) ]));
      toast("Removed Project");
   }

   return (
      <div className="box full dfb column gap-5 mt-1">
         <div className="text-xs full bold-500">Add a Project</div>
         <div className="box full dfb column gap-10">
            <input
               type="text" className="xxs pd-12 pdx-2 full mw-600"
               placeholder="Project Name"
               value={project.name}
               onChange={e => {
                  setProject(p => ({
                     ...p, name: e.target.value,
                     id: e.target.value.toLowerCase().replaceAll(" ", "-")
                  }))
               }}
            />
            <textarea
               className="xxs pd-12 pdx-2 full mw-600 h-20 border-radius-15"
               placeholder="Description"
               value={project.description}
               onChange={e => setProject(p => ({ ...p, description: e.target.value })) }
            />

            <div className="box full dfb wrap gap-10">
               {project.images.map((image, index) => (
                  <div key={index} className="cwb-custom-image-removable service-img">
                     <div className="close" onClick={() => removeProjectImage(index)}><XIcon size={20} strokeWidth={3} /></div>
                     <img src={image} alt="custom-image" />
                  </div>
               ))}
               {projectImgUrl !== "" && (<div className="cwb-custom-image-removable service-img">
                  <img src={projectImgUrl} alt="custom-image" />
               </div>)}
            </div>
            <div className="text-xs full bold-500 mt-2">Add an image url</div>
            <div className="box full dfb align-center gap-10">
               <input
                  type="text" className="xxs pd-12 pdx-2 full mw-600"
                  placeholder={"Project Image Url"}
                  value={projectImgUrl}
                  onChange={e => setProjectImgUrl(e.target.value)}
               />
               <button className="xxs pd-12 pdx-15" onClick={addProjectImage}>Add</button>
            </div>
            <button className="xxs pd-12 pdx-3" onClick={addProject}>Add Project</button>
         </div>

         <Spacing size={2} />
         {totalProjects?.length == 0 && (<div className="text-xxs grey-5">No Project Added</div>)}
         <div className="box full dfb wrap gap-10">
            {totalProjects?.map((project, index) => (
               <div key={index} className="cwb-custom-service-card">
                  <div className="cwb-custom-service-card-image">
                     <img src={project.images[0]} alt="first service image" />
                  </div>
                  <div className="cwb-custom-service-info">
                     <div className="text-xs full bold-600">{project.name}</div>
                     <div className="text-xxs full grey-5">{project.description}</div>
                     <div className="text-xxs full grey-5">{project.images.length} {pluralSuffixer('image', project.images.length, 's')}</div>
                     <button className="xxxxs pd-1 pdx-15 delete" onClick={() => removeProject(index)}>Remove Project</button>
                  </div>
               </div>
            ))}
         </div>
      </div>
   )
}

function ReviewsArrayFormElement ({ formSetting, initialValue, updateValue }: FormElementsProps) {
   const [totalReviews, setTotalReviews] = useState<ReviewsSectionValues>(initialValue);
   const [review, setReview] = useState<ReviewItem>({ name: "", review: "" });

   useEffect(() => updateValue(formSetting.key, totalReviews), [totalReviews])

   function addReview () {
      if ([review.name, review.review].includes("")) {
         toast.error("Please enter information about the review");
         return;
      }
      setTotalReviews(p => ([ ...p, review ]));
      setReview({ name: "", review: "" });
      toast("Added Review");
   }

   function removeReview (index: number) {
      setTotalReviews(prev => ([ ...prev.filter((_, i) => i !== index) ]));
      toast("Removed Review");
   }

   return (
      <div className="box full dfb column gap-5 mt-1">
         <div className="text-xs full bold-500">Add a Review</div>
         <div className="box full dfb column gap-10">
            <input
               type="text" className="xxs pd-12 pdx-2 full mw-600"
               placeholder="Customer Name"
               value={review.name}
               onChange={e => {
                  setReview(p => ({ ...p, name: e.target.value }))
               }}
            />
            <textarea
               className="xxs pd-12 pdx-2 full mw-600 h-20 border-radius-15"
               placeholder="Review"
               value={review.review}
               onChange={e => setReview(p => ({ ...p, review: e.target.value })) }
            />
            <button className="xxs pd-12 pdx-3" onClick={addReview}>Add Review</button>
         </div>

         <Spacing size={2} />
         {totalReviews.length == 0 && (<div className="text-xxs grey-5">No Reviews Added</div>)}
         <div className="box full dfb wrap gap-10">
            {totalReviews.map((review, index) => (
               <div key={index} className="cwb-review-card">
                  <div className="text-xs full bold-600">{review.name}</div>
                  <div className="text-xxs full grey-5">{review.review}</div>
                  <button className="xxxxs pd-1 pdx-15 delete" onClick={() => removeReview(index)}>Remove Review</button>
               </div>
            ))}
         </div>
      </div>
   )
}

function SocialMediaArrayFormElement ({ formSetting, initialValue, updateValue }: FormElementsProps) {
   const [totalSocialMediaPlatforms, setTotalSocialMediaPlatforms] = useState<SocialMediaSectionValues>(initialValue);
   const [socialMediaPlatform, setSocialMediaPlatform] = useState<SocialMediaLink>({
      link: "", label: "", platform: "facebook"
   });
   const socialPlatforms = [
      {
         optionName: "facebook",
         option: <div className="box full dfb align-center gap-10"><FacebookIcon size={18} color={"#1877F2"} /> Facebook</div>
      },
      {
         optionName: "instagram",
         option: <div className="box full dfb align-center gap-10"><InstagramIcon size={18} color={"#E4405F"} /> Instagram</div>
      },
      {
         optionName: "linkedin",
         option: <div className="box full dfb align-center gap-10"><LinkedinIcon size={18} color={"#0A66C2"} /> Linkedin</div>
      },
      {
         optionName: "twitter",
         option: <div className="box full dfb align-center gap-10"><TwitterIcon size={18} color={"#111827"} /> Twitter</div>
      },
      {
         optionName: "youtube",
         option: <div className="box full dfb align-center gap-10"><YoutubeIcon size={18} color={"#FF0000"} /> Youtube</div>
      },
      {
         optionName: "tiktok",
         option: <div className="box full dfb align-center gap-10"><TiktokIcon size={18} /> TikTok</div>
      },
   ]

   useEffect(() => updateValue(formSetting.key, totalSocialMediaPlatforms), [totalSocialMediaPlatforms])

   function addSocialMedia () {
      const { link, label, platform } = socialMediaPlatform;
      if ([link, label, platform].includes("")) {
         toast.error("Please enter information about the social media platform");
         return;
      }
      setTotalSocialMediaPlatforms(p => ([ ...p!, socialMediaPlatform ]));
      setSocialMediaPlatform({ link: "", label: "", platform: "facebook" });
      toast("Added Social Media Platform");
   }

   function removeSocialMedia (index: number) {
      setTotalSocialMediaPlatforms(prev => ([ ...prev!.filter((_, i) => i !== index) ]));
      toast("Removed Social Media Platform");
   }

   return (
      <div className="box full dfb column gap-5 mt-1">
         <div className="text-xs full bold-500">Add a Social Media Platform</div>
         <div className="box full dfb column gap-10">
            <div className="box full pd-1">
               <CustomSelect
                  options={socialPlatforms} onSelect={(option) => setSocialMediaPlatform(p => ({ ...p, platform: option }))}
                  style={{ padding: "7px 7px", width: "100%", maxWidth: "340px" }}
                  defaultOptionIndex={0}
               />
            </div>
            <input
               type="text" className="xxs pd-12 pdx-2 full mw-600"
               placeholder="Label"
               value={socialMediaPlatform.label}
               onChange={e => setSocialMediaPlatform(p => ({ ...p, label: e.target.value }))}
            />
            <input
               type="text" className="xxs pd-12 pdx-2 full mw-600"
               placeholder="Link"
               value={socialMediaPlatform.link}
               onChange={e => setSocialMediaPlatform(p => ({ ...p, link: e.target.value }))}
            />
            <button className="xxs pd-12 pdx-3" onClick={addSocialMedia}>Add Social Media Platform</button>
         </div>

         <Spacing size={2} />
         {totalSocialMediaPlatforms?.length == 0 && (<div className="text-xxs grey-5">No Social Media Platforms Added</div>)}
         <div className="box full dfb wrap gap-10">
            {totalSocialMediaPlatforms?.map((socialMediaPlatform, index) => (
               <div key={index} className="cwb-review-card">
                  <div className="text-xs full bold-600">{titleCase(socialMediaPlatform.platform)}</div>
                  <div className="text-xxs full grey-5">{socialMediaPlatform.label}</div>
                  <button className="xxxxs pd-1 pdx-15 delete" onClick={() => removeSocialMedia(index)}>Remove</button>
               </div>
            ))}
         </div>
      </div>
   )
}