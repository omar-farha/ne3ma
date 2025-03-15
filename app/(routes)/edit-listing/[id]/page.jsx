"use client";
import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Form, Formik } from "formik";
import { useParams, usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { supabase } from "@/utils/supabase/client";
import { toast } from "sonner";
import { useUser } from "@clerk/nextjs";
import FileUpload from "./_components/FileUpload";
import { Loader } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import Link from "next/link";

function EditListing() {
  const { user } = useUser();
  const router = useRouter();
  const params = useParams();
  const [listing, setListing] = useState([]);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    // console.log(params.split("/")[2]);
    user && verifyUser();
  }, [user]);

  const verifyUser = async () => {
    const { data, error } = await supabase
      .from("listing")
      .select("*")
      .eq("createdBy", user?.primaryEmailAddress.emailAddress)
      .eq("id", params.id);

    if (data) {
      setListing(data[0]);
    }
    if (data?.length <= 0) {
      router.replace("/");
    }
  };

  const onSubmitHandler = async (formValue) => {
    setLoading(true);
    const { data, error } = await supabase
      .from("listing")
      .update(formValue)
      .eq("id", params.id)
      .select();

    if (data) {
      console.log(data);
      toast("Event has been created.");
      setLoading(false);
    }

    for (const image of images) {
      setLoading(true);

      const file = image;
      const fileName = Date.now().toString();
      const fileExt = fileName.split(".").pop();
      const { data, error } = await supabase.storage
        .from("listingImages")
        .upload(`${fileName}`, file, {
          contentType: `image/${fileExt}`,
          upsert: false,
        });
      if (error) {
        setLoading(false);
        toast("Error uploading image");
      }
      if (error) {
        setLoading(false);
      } else {
        const imageUrl = process.env.NEXT_PUBLIC_IMAGE_URL + fileName;
        console.log(imageUrl);
        const { data, error } = await supabase
          .from("listingImages")
          .insert([{ url: imageUrl, listing_id: params?.id }]);
        toast(`Image ${fileName} uploaded successfully`);
        if (data) {
          setLoading(false);
          console.log(imageUrl);
        }
        if (error) {
          setLoading(false);
        }
      }
      setLoading(false);
    }
  };
  const publishBtn = async () => {
    setLoading(true);
    const { data, error } = await supabase

      .from("listing")
      .update({ active: true })
      .eq("id", params?.id)
      .select();
    if (data) {
      setLoading(false);
      toast("Listing has been published");
    }
  };
  return (
    <div className=" px-10 md:px-36 my-10">
      <h2 className=" font-bold  text-2xl text-center ">
        Enter some more details about your listing
      </h2>

      <Formik
        initialValues={{
          type: "",
          delivery: "",
          surplusType: "",
          condition: "",
          profileImage: user?.imageUrl,
          fullName: user?.fullName,
        }}
        onSubmit={(values) => {
          console.log(values);
          onSubmitHandler(values);
        }}
      >
        {({ values, handleChange, handleSubmit }) => (
          <form onSubmit={handleSubmit}>
            <div className="p-5 border rounded-md shadow-md grid gap-7 mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                <div className="flex flex-col gap-2 ">
                  <h2 className="text-lg text-slate-500">Donate or Request?</h2>
                  <RadioGroup
                    defaultValue={listing?.type}
                    onValueChange={(v) => (values.type = v)}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Donate" id="Donate" />
                      <Label htmlFor="Donate">Donate</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Request" id="Request" />
                      <Label htmlFor="Request">Request</Label>
                    </div>
                  </RadioGroup>
                </div>
                <div className="flex flex-col gap-3">
                  <h2 className="text-lg text-slate-400 lg:mt-0">
                    {" "}
                    Surplus Type
                  </h2>
                  <Select
                    onValueChange={(e) => (values.surplusType = e)}
                    name="surplusType"
                    defaultValue={listing?.surplusType}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Food">Food</SelectItem>
                      <SelectItem value="Medicen">Medicine</SelectItem>
                      <SelectItem value="Industry">Tools</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 ">
                <div className="flex flex-col gap-2">
                  <h2 className="text-gray-500">Amount of Items</h2>
                  <Input
                    type="number"
                    placeholder="Amount"
                    name="amount"
                    onChange={handleChange}
                    defaultValue={listing?.amount}
                    required
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <h2 className="text-gray-500">Expiration Date</h2>
                  <Input
                    placeholder="Ex.2"
                    name="date"
                    type="date"
                    onChange={handleChange}
                    defaultValue={listing?.date}
                    required
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <h2 className="text-gray-500">Item Condition</h2>
                  <Select
                    onValueChange={(e) => (values.condition = e)}
                    name="condition"
                    defaultValue={listing?.condition}
                    required
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Condition" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="New">New</SelectItem>
                      <SelectItem value="Used">Used</SelectItem>
                      <SelectItem value="Need Rapair">Needs Repair</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                <div className="flex flex-col gap-2">
                  <h2 className="text-gray-500">Area</h2>
                  <Input
                    placeholder="street 24"
                    name="area"
                    onChange={handleChange}
                    defaultValue={listing?.area}
                    required
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <h2 className="text-gray-500">Selling Price</h2>
                  <Input
                    type="number"
                    placeholder="500 EGP"
                    name="price"
                    onChange={handleChange}
                    defaultValue={listing?.price}
                    required
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <h2 className="text-gray-500">Delivery Assistance Needed?</h2>
                  <RadioGroup
                    defaultValue={listing?.delivery}
                    onValueChange={(d) => (values.delivery = d)}
                    required
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Yes" id="Yes" />
                      <Label htmlFor="Yes">Yes</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="No" id="No" />
                      <Label htmlFor="No">No</Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>
              <div className="grid  grid-cols-1 gap-10">
                <div className="flex gap-2 flex-col">
                  <h2 className="text-gray-500">Description</h2>
                  <Textarea
                    placeholder="Description"
                    name="description"
                    onChange={handleChange}
                    defaultValue={listing?.description}
                    required
                  />
                </div>
              </div>
              <div>
                <h2 className="text-lg text-gray-500 my-2">
                  Upload Surplus Images
                </h2>
                <FileUpload
                  setImages={(value) => {
                    setImages(value);
                  }}
                />
              </div>
              <div className="flex gap-7 justify-end mt-5">
                <Button
                  disabled={loading}
                  variant="outline"
                  type="submit"
                  className="text-primary border-primary"
                >
                  {loading ? <Loader className="animate-spin" /> : "Save"}
                </Button>

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button disabled={loading} className="" type="submit">
                      {loading ? (
                        <Loader className="animate-spin" />
                      ) : (
                        "Save & Publish"
                      )}
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        Are you ready to Publish?
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        Do you really want to publish this listing?
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <Link href="/">
                        <AlertDialogAction onClick={() => publishBtn()}>
                          {loading ? (
                            <Loader className="animate-spin" />
                          ) : (
                            "Continue"
                          )}
                        </AlertDialogAction>
                      </Link>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          </form>
        )}
      </Formik>
    </div>
  );
}

export default EditListing;
