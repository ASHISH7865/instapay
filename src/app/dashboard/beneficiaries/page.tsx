'use client'
import React, { useState, useEffect, useCallback, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import PageHeader from '@/components/shared/PageHeader'
import { Card, CardContent } from '@/components/ui/card'
import { SendMoneyModal } from '@/components/modal/send-money-v3'
import BeneficiaryModal from '@/components/modal/BeneficiaryModal'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import {
    Users,
    Plus,
    Search,
    Star,
    MoreVertical,
    Send,
    Edit,
    Trash2,
    Clock,
    DollarSign,
    Heart,
    Building,
    User,
    Loader2,
    AlertCircle
} from 'lucide-react'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator
} from '@/components/ui/dropdown-menu'
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { useBeneficiaries, type Beneficiary, type CreateBeneficiaryData, type UpdateBeneficiaryData } from '@/hooks/useBeneficiaries'

const BeneficiariesPage = () => {
    const {
        beneficiaries,
        loading,
        error,
        pagination,
        fetchBeneficiaries,
        createBeneficiary,
        updateBeneficiary,
        deleteBeneficiary,
        toggleFavorite,
        searchBeneficiaries,
        filterByCategory,
        toggleFavoritesFilter,
        changePage,
        refresh
    } = useBeneficiaries()

    const [searchQuery, setSearchQuery] = useState('')
    const [selectedCategory, setSelectedCategory] = useState('all')
    const [showFavoritesOnly, setShowFavoritesOnly] = useState(false)
    const [isSendMoneyModalOpen, setIsSendMoneyModalOpen] = useState(false)
    const [isBeneficiaryModalOpen, setIsBeneficiaryModalOpen] = useState(false)
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
    const [selectedBeneficiary, setSelectedBeneficiary] = useState<{
        name: string;
        email?: string;
    } | null>(null)
    const [editingBeneficiary, setEditingBeneficiary] = useState<Beneficiary | null>(null)
    const [deletingBeneficiary, setDeletingBeneficiary] = useState<Beneficiary | null>(null)
    const [modalMode, setModalMode] = useState<'create' | 'edit'>('create')

    // Memoized computed values
    const stats = useMemo(() => {
        const totalAmount = beneficiaries.reduce((sum, b) => sum + Number(b.totalAmount), 0)
        const favoritesCount = beneficiaries.filter(b => b.isFavorite).length
        const activeCount = beneficiaries.filter(b => b.isActive).length
        const thisMonthCount = beneficiaries.filter(b => {
            if (!b.lastUsedAt) return false
            const lastUsed = new Date(b.lastUsedAt)
            const thisMonth = new Date()
            return lastUsed.getMonth() === thisMonth.getMonth() && lastUsed.getFullYear() === thisMonth.getFullYear()
        }).length

        return { totalAmount, favoritesCount, activeCount, thisMonthCount }
    }, [beneficiaries])

    // Debounced search effect
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            if (searchQuery) {
                searchBeneficiaries(searchQuery)
            } else {
                fetchBeneficiaries({ search: '', page: 1 })
            }
        }, 300)

        return () => clearTimeout(timeoutId)
    }, [searchQuery]) // Removed dependencies that cause infinite loops

    // Category filter effect
    useEffect(() => {
        if (selectedCategory !== 'all') {
            filterByCategory(selectedCategory)
        } else {
            fetchBeneficiaries({ category: '', page: 1 })
        }
    }, [selectedCategory]) // Removed dependencies that cause infinite loops

    // Favorites filter effect
    useEffect(() => {
        toggleFavoritesFilter(showFavoritesOnly)
    }, [showFavoritesOnly]) // Removed dependencies that cause infinite loops

    // Memoized utility functions
    const getInitials = useCallback((name: string) => {
        return name.split(' ').map(n => n[0]).join('').toUpperCase()
    }, [])

    const getCategoryIcon = useCallback((category: string) => {
        switch (category) {
            case 'family': return Heart
            case 'business': return Building
            default: return User
        }
    }, [])

    const getCategoryColor = useCallback((category: string) => {
        switch (category) {
            case 'family': return 'text-red-600 dark:text-red-400 bg-red-500/20'
            case 'business': return 'text-blue-600 dark:text-blue-400 bg-blue-500/20'
            default: return 'text-emerald-600 dark:text-emerald-400 bg-emerald-500/20'
        }
    }, [])

    const formatLastTransaction = useCallback((date: string | undefined) => {
        if (!date) return 'Never'

        const transactionDate = new Date(date)
        const now = new Date()
        const diffTime = Math.abs(now.getTime() - transactionDate.getTime())
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

        if (diffDays === 1) return 'Yesterday'
        if (diffDays < 7) return `${diffDays} days ago`
        if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`
        return `${Math.floor(diffDays / 30)} months ago`
    }, [])

    // Memoized event handlers
    const handleCreateBeneficiary = useCallback(async (data: CreateBeneficiaryData) => {
        const result = await createBeneficiary(data)
        if (result) {
            setIsBeneficiaryModalOpen(false)
            setModalMode('create')
        }
    }, [createBeneficiary])

    const handleUpdateBeneficiary = useCallback(async (data: CreateBeneficiaryData) => {
        if (!editingBeneficiary) return

        const updateData: UpdateBeneficiaryData = {
            ...data,
            isFavorite: data.isFavorite
        }

        const result = await updateBeneficiary(editingBeneficiary.id, updateData)
        if (result) {
            setIsBeneficiaryModalOpen(false)
            setEditingBeneficiary(null)
            setModalMode('create')
        }
    }, [editingBeneficiary, updateBeneficiary])

    const handleDeleteBeneficiary = useCallback(async () => {
        if (!deletingBeneficiary) return

        const success = await deleteBeneficiary(deletingBeneficiary.id)
        if (success) {
            setIsDeleteDialogOpen(false)
            setDeletingBeneficiary(null)
        }
    }, [deletingBeneficiary, deleteBeneficiary])

    const handleEditBeneficiary = useCallback((beneficiary: Beneficiary) => {
        setEditingBeneficiary(beneficiary)
        setModalMode('edit')
        setIsBeneficiaryModalOpen(true)
    }, [])

    const handleDeleteClick = useCallback((beneficiary: Beneficiary) => {
        setDeletingBeneficiary(beneficiary)
        setIsDeleteDialogOpen(true)
    }, [])

    const handleToggleFavorite = useCallback(async (beneficiary: Beneficiary) => {
        await toggleFavorite(beneficiary.id)
    }, [toggleFavorite])

    const handleAddBeneficiary = useCallback(() => {
        setModalMode('create')
        setEditingBeneficiary(null)
        setIsBeneficiaryModalOpen(true)
    }, [])

    const handleModalClose = useCallback(() => {
        setIsBeneficiaryModalOpen(false)
        setEditingBeneficiary(null)
        setModalMode('create')
    }, [])

    const handleSendMoney = useCallback((beneficiary: Beneficiary) => {
        setSelectedBeneficiary({
            name: beneficiary.name,
            email: beneficiary.email
        })
        setIsSendMoneyModalOpen(true)
    }, [])

    const handleSendMoneyClose = useCallback(() => {
        setIsSendMoneyModalOpen(false)
        setSelectedBeneficiary(null)
    }, [])

    const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value)
    }, [])

    const handleCategoryChange = useCallback((category: string) => {
        setSelectedCategory(category)
    }, [])

    const handleFavoritesToggle = useCallback(() => {
        setShowFavoritesOnly(prev => !prev)
    }, [])

    const handlePageChange = useCallback((page: number) => {
        changePage(page)
    }, [changePage])

    // Memoized beneficiary card component
    const BeneficiaryCard = useCallback(({ beneficiary, index }: { beneficiary: Beneficiary; index: number }) => {
        const CategoryIcon = getCategoryIcon(beneficiary.relationship || 'other')

        return (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02, y: -5 }}
            >
                <Card className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-white/20 dark:border-slate-700/50 hover:shadow-xl transition-all duration-300">
                    <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <div className="relative">
                                    <Avatar className="h-12 w-12 ring-2 ring-white/20">
                                        <AvatarImage src={undefined} />
                                        <AvatarFallback className="bg-gradient-to-br from-primary/20 to-primary/10 text-primary font-semibold">
                                            {getInitials(beneficiary.name)}
                                        </AvatarFallback>
                                    </Avatar>
                                    {beneficiary.isFavorite && (
                                        <div className="absolute -top-1 -right-1 w-5 h-5 bg-yellow-500 rounded-full flex items-center justify-center">
                                            <Star className="h-3 w-3 text-white fill-current" />
                                        </div>
                                    )}
                                </div>
                                <div>
                                    <h3 className="font-semibold text-foreground">{beneficiary.name}</h3>
                                    <p className="text-sm text-muted-foreground">{beneficiary.relationship || 'Other'}</p>
                                </div>
                            </div>

                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="sm" className="p-2">
                                        <MoreVertical className="h-4 w-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuItem onClick={() => handleSendMoney(beneficiary)}>
                                        <Send className="h-4 w-4 mr-2" />
                                        Send Money
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => handleEditBeneficiary(beneficiary)}>
                                        <Edit className="h-4 w-4 mr-2" />
                                        Edit Details
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => handleToggleFavorite(beneficiary)}>
                                        <Star className="h-4 w-4 mr-2" />
                                        {beneficiary.isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem
                                        className="text-red-600"
                                        onClick={() => handleDeleteClick(beneficiary)}
                                    >
                                        <Trash2 className="h-4 w-4 mr-2" />
                                        Remove
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>

                        <div className="space-y-3">
                            <div className="flex items-center gap-2">
                                <div className={`w-6 h-6 rounded-lg flex items-center justify-center ${getCategoryColor(beneficiary.relationship || 'other')}`}>
                                    <CategoryIcon className="h-3 w-3" />
                                </div>
                                <span className="text-sm capitalize text-muted-foreground">{beneficiary.relationship || 'other'}</span>
                                <Badge variant={beneficiary.isActive ? 'default' : 'secondary'} className="ml-auto">
                                    {beneficiary.isActive ? 'active' : 'inactive'}
                                </Badge>
                            </div>

                            <Separator />

                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Total Sent:</span>
                                    <span className="font-medium">${Number(beneficiary.totalAmount).toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Transactions:</span>
                                    <span className="font-medium">{beneficiary.totalTransactions}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Last Payment:</span>
                                    <span className="font-medium">{formatLastTransaction(beneficiary.lastUsedAt)}</span>
                                </div>
                            </div>

                            <div className="flex gap-2 pt-2">
                                <Button
                                    size="sm"
                                    className="flex-1"
                                    onClick={() => handleSendMoney(beneficiary)}
                                >
                                    <Send className="h-4 w-4 mr-2" />
                                    Send Money
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleEditBeneficiary(beneficiary)}
                                >
                                    <Edit className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>
        )
    }, [getInitials, getCategoryIcon, getCategoryColor, formatLastTransaction, handleSendMoney, handleEditBeneficiary, handleToggleFavorite, handleDeleteClick])

    if (error) {
        return (
            <div className="flex-1 space-y-6 p-6">
                <div className="flex items-center justify-center h-64">
                    <Card className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-white/20 dark:border-slate-700/50">
                        <CardContent className="p-8 text-center">
                            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-foreground mb-2">Error Loading Beneficiaries</h3>
                            <p className="text-muted-foreground mb-4">{error}</p>
                            <Button onClick={refresh} className="flex items-center gap-2">
                                <Loader2 className="h-4 w-4" />
                                Try Again
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        )
    }

    return (
        <div className="flex-1 space-y-6 p-6">
            <PageHeader
                title="Beneficiaries"
                description="Manage your saved recipients and frequent contacts"
                icon={Users}
                actions={
                    <Button
                        className="bg-gradient-to-r from-primary to-primary/80"
                        onClick={handleAddBeneficiary}
                        disabled={loading}
                    >
                        {loading ? (
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        ) : (
                            <Plus className="h-4 w-4 mr-2" />
                        )}
                        Add Beneficiary
                    </Button>
                }
            />

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-white/20 dark:border-slate-700/50">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">Total Recipients</p>
                                <p className="text-2xl font-bold text-foreground">{stats.activeCount}</p>
                            </div>
                            <div className="w-10 h-10 bg-blue-500/20 rounded-xl flex items-center justify-center">
                                <Users className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-white/20 dark:border-slate-700/50">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">Favorites</p>
                                <p className="text-2xl font-bold text-foreground">{stats.favoritesCount}</p>
                            </div>
                            <div className="w-10 h-10 bg-yellow-500/20 rounded-xl flex items-center justify-center">
                                <Star className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-white/20 dark:border-slate-700/50">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">Total Sent</p>
                                <p className="text-2xl font-bold text-foreground">
                                    ${stats.totalAmount.toLocaleString()}
                                </p>
                            </div>
                            <div className="w-10 h-10 bg-emerald-500/20 rounded-xl flex items-center justify-center">
                                <DollarSign className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-white/20 dark:border-slate-700/50">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">This Month</p>
                                <p className="text-2xl font-bold text-foreground">{stats.thisMonthCount}</p>
                            </div>
                            <div className="w-10 h-10 bg-purple-500/20 rounded-xl flex items-center justify-center">
                                <Clock className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Search and Filters */}
            <Card className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-white/20 dark:border-slate-700/50">
                <CardContent className="p-4">
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search beneficiaries..."
                                value={searchQuery}
                                onChange={handleSearchChange}
                                className="pl-10"
                                disabled={loading}
                            />
                        </div>
                        <div className="flex gap-2">
                            <Button
                                variant={selectedCategory === 'all' ? 'default' : 'outline'}
                                size="sm"
                                onClick={() => handleCategoryChange('all')}
                                disabled={loading}
                            >
                                All
                            </Button>
                            <Button
                                variant={selectedCategory === 'friend' ? 'default' : 'outline'}
                                size="sm"
                                onClick={() => handleCategoryChange('friend')}
                                disabled={loading}
                            >
                                Personal
                            </Button>
                            <Button
                                variant={selectedCategory === 'business' ? 'default' : 'outline'}
                                size="sm"
                                onClick={() => handleCategoryChange('business')}
                                disabled={loading}
                            >
                                Business
                            </Button>
                            <Button
                                variant={selectedCategory === 'family' ? 'default' : 'outline'}
                                size="sm"
                                onClick={() => handleCategoryChange('family')}
                                disabled={loading}
                            >
                                Family
                            </Button>
                            <Button
                                variant={showFavoritesOnly ? 'default' : 'outline'}
                                size="sm"
                                onClick={handleFavoritesToggle}
                                disabled={loading}
                            >
                                <Star className="h-4 w-4 mr-1" />
                                Favorites
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Beneficiaries List */}
            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[...Array(6)].map((_, index) => (
                        <Card key={index} className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-white/20 dark:border-slate-700/50">
                            <CardContent className="p-6">
                                <div className="animate-pulse">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="w-12 h-12 bg-gray-300 rounded-full"></div>
                                        <div className="flex-1">
                                            <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
                                            <div className="h-3 bg-gray-300 rounded w-1/2"></div>
                                        </div>
                                    </div>
                                    <div className="space-y-3">
                                        <div className="h-3 bg-gray-300 rounded"></div>
                                        <div className="h-3 bg-gray-300 rounded w-2/3"></div>
                                        <div className="h-3 bg-gray-300 rounded w-1/2"></div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <AnimatePresence>
                        {beneficiaries.map((beneficiary, index) => (
                            <BeneficiaryCard key={beneficiary.id} beneficiary={beneficiary} index={index} />
                        ))}
                    </AnimatePresence>
                </div>
            )}

            {!loading && beneficiaries.length === 0 && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-12"
                >
                    <Users className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-foreground mb-2">No beneficiaries found</h3>
                    <p className="text-muted-foreground mb-6">
                        {searchQuery ? 'Try adjusting your search criteria' : 'Add your first beneficiary to get started'}
                    </p>
                    <Button onClick={handleAddBeneficiary}>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Beneficiary
                    </Button>
                </motion.div>
            )}

            {/* Pagination */}
            {pagination && pagination.totalPages > 1 && (
                <div className="flex justify-center">
                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handlePageChange(pagination.page - 1)}
                            disabled={!pagination.hasPrevPage}
                        >
                            Previous
                        </Button>
                        <span className="flex items-center px-4 text-sm text-muted-foreground">
                            Page {pagination.page} of {pagination.totalPages}
                        </span>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handlePageChange(pagination.page + 1)}
                            disabled={!pagination.hasNextPage}
                        >
                            Next
                        </Button>
                    </div>
                </div>
            )}

            {/* Send Money Modal */}
            <SendMoneyModal
                isOpen={isSendMoneyModalOpen}
                onClose={handleSendMoneyClose}
                defaultRecipient={selectedBeneficiary?.email}
            />

            {/* Beneficiary Modal */}
            <BeneficiaryModal
                open={isBeneficiaryModalOpen}
                onClose={handleModalClose}
                onSubmit={modalMode === 'create' ? handleCreateBeneficiary : handleUpdateBeneficiary}
                beneficiary={editingBeneficiary ? {
                    name: editingBeneficiary.name,
                    email: editingBeneficiary.email,
                    phoneNumber: editingBeneficiary.phoneNumber,
                    relationship: editingBeneficiary.relationship as 'family' | 'friend' | 'business' | 'other',
                    nickname: editingBeneficiary.nickname,
                    isFavorite: editingBeneficiary.isFavorite
                } : undefined}
                mode={modalMode}
            />

            {/* Delete Confirmation Dialog */}
            <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete Beneficiary</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to delete &quot;{deletingBeneficiary?.name}&quot;? This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDeleteBeneficiary}
                            className="bg-red-600 hover:bg-red-700"
                        >
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}

export default BeneficiariesPage
