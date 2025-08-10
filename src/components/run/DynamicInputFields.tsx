import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'
import { useForm, useFieldArray, Controller } from 'react-hook-form'
import { Plus, X } from 'lucide-react'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Label } from '../ui/label'

interface InputField {
  field: string
  value: string
}

interface DynamicInputFieldsProps {
  onChange?: (data: InputField[]) => void
  onValidationChange?: (isValid: boolean) => void
}

export default function DynamicInputFields({ onChange, onValidationChange }: DynamicInputFieldsProps) {
  const { control, handleSubmit, formState: { errors, isValid }, watch, trigger } = useForm<{ inputs: InputField[] }>({
    defaultValues: {
      inputs: [{ field: '', value: '' }]
    },
    mode: 'onChange',
    reValidateMode: 'onChange'
  })

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'inputs'
  })

  const watchedInputs = watch('inputs')

  // Pattern for field name: only letters, numbers, underscore, hyphen (no spaces)
  const fieldNamePattern = /^[a-zA-Z0-9_-]*$/
  
  // Pattern for value: alphanumeric + specific special characters including dot
  const valuePattern = /^[a-zA-Z0-9_\-@#/{}().]*$/

  const validateFieldName = (value: string) => {
    if (value && !fieldNamePattern.test(value)) {
      return 'Only letters, numbers, underscore (_), and hyphen (-) are allowed'
    }
    return true
  }

  const validateFieldValue = (value: string) => {
    if (value && !valuePattern.test(value)) {
      return 'Only letters, numbers, and these special characters: _ - @ # / { } ( ) . are allowed'
    }
    return true
  }

  // Check if there are any validation errors
  const hasErrors = Object.keys(errors.inputs || {}).some(key => 
    errors.inputs?.[parseInt(key)]?.field || errors.inputs?.[parseInt(key)]?.value
  )

  // Check if the last row has both field and value filled (to enable Add button)
  const canAddNewParameter = fields.length === 0 || (
    fields.every((_field, index) => {
      const fieldValue = watchedInputs[index]?.field?.trim() || ''
      const valueValue = watchedInputs[index]?.value?.trim() || ''
      return fieldValue !== '' && valueValue !== ''
    })
  )

  // Update parent component when form changes
  useEffect(() => {
    const validInputs = watchedInputs.filter(input => input.field || input.value)
    onChange?.(validInputs)
    onValidationChange?.(isValid)
  }, [watchedInputs, isValid, onChange, onValidationChange])

  const addNewRow = () => {
    append({ field: '', value: '' })
  }

  const removeRow = (index: number) => {
    if (fields.length > 1) {
      remove(index)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full"
    >
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label className="text-lg font-semibold text-foreground">
            Runtime Input Parameters
          </Label>
          <Button
            type="button"
            onClick={addNewRow}
            size="sm"
            disabled={hasErrors || !canAddNewParameter}
            className="bg-primary hover:bg-primary/90 disabled:bg-muted disabled:text-muted-foreground text-primary-foreground transition-all duration-300"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Parameter
          </Button>
        </div>

        <div className="max-h-64 overflow-y-auto border border-border rounded-lg p-4 bg-card">
          <AnimatePresence>
            {fields.map((field, index) => (
              <motion.div
                key={field.id}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="mb-4 last:mb-0"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <Label htmlFor={`field-${index}`} className="text-sm font-medium">
                      Field Name
                    </Label>
                    <Controller
                      control={control}
                      name={`inputs.${index}.field`}
                      rules={{ validate: validateFieldName }}
                      render={({ field: controllerField }) => (
                        <div>
                          <Input
                            {...controllerField}
                            id={`field-${index}`}
                            placeholder="e.g. api_key, user-id"
                            onChange={(e) => {
                              controllerField.onChange(e)
                              // Trigger real-time validation
                              setTimeout(() => trigger(`inputs.${index}.field`), 0)
                            }}
                            className={`transition-all duration-200 ${
                              errors.inputs?.[index]?.field 
                                ? 'border-destructive focus:border-destructive focus:ring-destructive/20' 
                                : 'border-border focus:border-primary'
                            }`}
                          />
                          <p className="text-xs text-muted-foreground mt-1">
                            Allowed: letters, numbers, underscore (_), hyphen (-)
                          </p>
                        </div>
                      )}
                    />
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <Label htmlFor={`value-${index}`} className="text-sm font-medium">
                        Value
                      </Label>
                      {fields.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeRow(index)}
                          className="h-6 w-6 p-0 text-muted-foreground hover:text-destructive"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                    <Controller
                      control={control}
                      name={`inputs.${index}.value`}
                      rules={{ validate: validateFieldValue }}
                      render={({ field: controllerField }) => (
                        <div>
                          <Input
                            {...controllerField}
                            id={`value-${index}`}
                            placeholder="e.g. config@test.com, user/profile"
                            disabled={
                              !watchedInputs[index]?.field?.trim() || 
                              !!errors.inputs?.[index]?.field
                            }
                            onChange={(e) => {
                              controllerField.onChange(e)
                              // Trigger real-time validation
                              setTimeout(() => trigger(`inputs.${index}.value`), 0)
                            }}
                            className={`transition-all duration-200 ${
                              errors.inputs?.[index]?.value 
                                ? 'border-destructive focus:border-destructive focus:ring-destructive/20' 
                                : 'border-border focus:border-primary'
                            }`}
                          />
                          <p className="text-xs text-muted-foreground mt-1">
                            Allowed: letters, numbers, _ - @ # / {`{ } ( )`} .
                          </p>
                        </div>
                      )}
                    />
                  </div>
                </div>

                {/* Error Messages */}
                {(errors.inputs?.[index]?.field || errors.inputs?.[index]?.value) && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="mt-2 p-2 bg-destructive/10 border border-destructive/20 rounded-md"
                  >
                    <p className="text-sm text-destructive font-medium">
                      {errors.inputs?.[index]?.field?.message || errors.inputs?.[index]?.value?.message}
                    </p>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>

          {fields.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <p>No input parameters added</p>
              <p className="text-sm">Click "Add Parameter" to get started</p>
            </div>
          )}
        </div>

        <p className="text-sm text-muted-foreground">
          Optional parameters for runtime configuration. Field names support letters, numbers, underscore, and hyphen only. Values support additional special characters.
        </p>
      </div>
    </motion.div>
  )
}