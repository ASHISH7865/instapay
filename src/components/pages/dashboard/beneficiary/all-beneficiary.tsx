'use client';
import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Edit2, Trash2, PlusIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import AddBeneficiary from "@/components/modal/add-beneficiary";
import { ModalOpenMode, ModalState } from "@/types/modal";


interface BeneficiaryData {
  id: number;
  name: string;
  email: string;
}

const data: BeneficiaryData[] = [
  { id: 1, name: "John Doe", email: "Johndoe@gmail.com" },
  { id: 2, name: "Jane Doe", email: "Johndoe@gmail.com" },
  { id: 3, name: "John Doe", email: "Johndoe@gmail.com" },
  { id: 4, name: "Jane Doe", email: "Johndoe@gmail.com" },
];




const AllBeneficiary = () => {

  const [modalOpen , setModalOpen] = useState<ModalState>({
    isOpen : false,
    mode : "create",
    data: {}
  })  

  const handleOpenModal = (mode:ModalOpenMode , data: object) => {
    setModalOpen({
      isOpen: true,
      mode: mode,
      data: data
    })
  }

  const handleCloseModal = () => {
    console.log("close")
    setModalOpen({
      isOpen: false,
      mode: "create",
      data: {}
    })
  }

  return (
    <div>
      <div className="flex justify-between items-center">
        <p className="text-md font-bold">All Beneficiaries</p>
        <Input
          type="text"
          placeholder="Search Beneficiaries"
          className="w-64"
        />
        <Button className="mt-2" variant="default" onClick={() => handleOpenModal("create" , {message:"this is create mode"})} >
            <PlusIcon size={20} className="mr-2" />
            Add Beneficiary
            </Button>
      </div>
      <Table className="w-full">
        <TableHeader>
          <TableRow>
            <TableHead className="">Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((item) => (
            <TableRow key={item.id}>
              <TableCell className="font-medium">{item.name}</TableCell>
              <TableCell>{item.email}</TableCell>
              <TableCell>
                <Badge className="bg-green-600">Active</Badge>
              </TableCell>
              <TableCell className="flex justify-end gap-2">
                <Edit2 size={20} className="text-blue-500" onClick={() => handleOpenModal("edit" , {message:"this is edit mode"})} />
                <Trash2 size={20} className="text-red-800" />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <AddBeneficiary open={modalOpen.isOpen} onClose={handleCloseModal} defaultValue={modalOpen.data} mode={modalOpen.mode} />
    </div>
  );
};

export default AllBeneficiary;
