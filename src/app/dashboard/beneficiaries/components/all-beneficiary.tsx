// 'use client'
// import React, { useState } from 'react'
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from '@/components/ui/table'
// import { Trash2, PlusIcon } from 'lucide-react'
// import { Badge } from '@/components/ui/badge'
// import { Button } from '@/components/ui/button'
// import UpsertBeneficiaryModal from '@/components/modal/upsertBeneficiaryModal'
// import { ModalOpenMode, ModalState } from '@/types/modal'
// import Spinner from '@/components/shared/spinner'
// interface AllBeneficiaryProps {
//   beneficiaries: BeneficiaryData[]
// }

// const AllBeneficiary = ({ beneficiaries }: AllBeneficiaryProps) => {
//   const [loading, setLoading] = useState(false)
//   const [beneficiariesData, setBeneficiariesData] = useState<BeneficiaryData[]>(beneficiaries)
//   const [modalOpen, setModalOpen] = useState<ModalState>({
//     isOpen: false,
//     mode: 'create',
//     defaultValues: {
//       userId: '',
//     },
//   })

//   const handleOpenModal = (mode: ModalOpenMode, data: BeneficiaryDefaultValuesTypes) => {
//     setModalOpen({
//       isOpen: true,
//       mode: mode,
//       defaultValues: data,
//     })
//   }

//   const handleCloseModal = () => {
//     setModalOpen({
//       isOpen: false,
//       mode: 'create',
//       defaultValues: {
//         userId: '',
//       },
//     })
//   }

//   const handleDeleteBeneficiary = async (id: string) => {
//     setLoading(true)
//     await deleteBeneficiary(id)
//     setLoading(false)
//   }

//   return (
//     <div>
//       <div className='flex justify-between items-center'>
//         <p className='text-md font-bold'>All Beneficiaries</p>
//         <SearchComponent
//           data={beneficiariesData}
//           setData={setBeneficiariesData}
//           searchKeys={['name', 'email']}
//         />
//         <Button
//           className='mt-2'
//           variant='secondary'
//           onClick={() => handleOpenModal('create', { userId: '' })}
//         >
//           <PlusIcon size={20} className='mr-2' />
//           Add Beneficiary
//         </Button>
//       </div>
//       <Table className='w-full'>
//         <TableHeader>
//           <TableRow>
//             <TableHead className=''>Name</TableHead>
//             <TableHead>Email</TableHead>
//             <TableHead>Status</TableHead>
//             <TableHead className='text-right'>Action</TableHead>
//           </TableRow>
//         </TableHeader>
//         <TableBody>
//           {beneficiariesData.map((item) => (
//             <TableRow key={item.id}>
//               <TableCell className='font-medium'>{item.name}</TableCell>
//               <TableCell>{item.email}</TableCell>
//               <TableCell>
//                 <Badge>Active</Badge>
//               </TableCell>
//               <TableCell className='flex justify-end gap-2'>
//                 {loading ? (
//                   <Spinner size={4} />
//                 ) : (
//                   <Trash2
//                     size={20}
//                     className='text-red-800'
//                     onClick={() => handleDeleteBeneficiary(item.id)}
//                   />
//                 )}
//               </TableCell>
//             </TableRow>
//           ))}
//           {beneficiaries.length === 0 && (
//             <TableRow>
//               <TableCell colSpan={4} className='text-center text-muted-foreground'>
//                 No Beneficiaries found
//               </TableCell>
//             </TableRow>
//           )}
//         </TableBody>
//       </Table>
//       {/* Modal */}
//       <UpsertBeneficiaryModal
//         open={modalOpen.isOpen}
//         onClose={handleCloseModal}
//         defaultValue={modalOpen.defaultValues}
//         mode={modalOpen.mode}
//       />
//     </div>
//   )
// }

// export default AllBeneficiary

import React from 'react'

const AllBeneficiary = () => {
  return <div>all-beneficiary</div>
}

export default AllBeneficiary
