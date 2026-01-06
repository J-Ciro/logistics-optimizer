import { useState, FormEvent, ChangeEvent } from 'react';
import { IQuoteRequest } from '../../domain/models/QuoteRequest';

interface QuoteRequestFormProps {
  onSubmit: (data: IQuoteRequest) => void;
}

interface FormErrors {
  origin?: string;
  destination?: string;
  weight?: string;
  pickupDate?: string;
}

export const QuoteRequestForm = ({ onSubmit }: QuoteRequestFormProps) => {
  const [formData, setFormData] = useState({
    origin: '',
    destination: '',
    weight: '',
    pickupDate: '',
    fragile: false,
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const validateField = (name: string, value: string | boolean): string | undefined => {
    switch (name) {
      case 'origin':
        if (typeof value === 'string' && value.trim() === '') {
          return 'El origen es requerido';
        }
        break;

      case 'destination':
        if (typeof value === 'string' && value.trim() === '') {
          return 'El destino es requerido';
        }
        break;

      case 'weight': {
        const weightNum = parseFloat(value as string);
        if (isNaN(weightNum) || weightNum <= 0) {
          return 'El peso debe ser mayor a 0.1 kg';
        }
        if (weightNum < 0.1) {
          return 'El peso debe ser mayor a 0.1 kg';
        }
        if (weightNum > 1000) {
          return 'El peso máximo permitido es 1000 kg';
        }
        break;
      }

      case 'pickupDate': {
        if (typeof value === 'string' && value) {
          const selectedDate = new Date(value + 'T00:00:00');
          const today = new Date();
          today.setHours(0, 0, 0, 0);

          if (selectedDate < today) {
            return 'La fecha no puede ser anterior a hoy';
          }

          const maxDate = new Date();
          maxDate.setDate(maxDate.getDate() + 30);
          maxDate.setHours(0, 0, 0, 0);

          if (selectedDate > maxDate) {
            return 'La fecha no puede ser mayor a 30 días';
          }
        }
        break;
      }
    }
    return undefined;
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Validate all fields
    const originError = validateField('origin', formData.origin);
    if (originError) newErrors.origin = originError;

    const destinationError = validateField('destination', formData.destination);
    if (destinationError) newErrors.destination = destinationError;

    const weightError = validateField('weight', formData.weight);
    if (weightError) newErrors.weight = weightError;

    const dateError = validateField('pickupDate', formData.pickupDate);
    if (dateError) newErrors.pickupDate = dateError;

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    const fieldValue = type === 'checkbox' ? checked : value;

    setFormData(prev => ({
      ...prev,
      [name]: fieldValue,
    }));

    // Validate on change if field has been touched
    if (touched[name]) {
      const error = validateField(name, fieldValue);
      setErrors(prev => ({
        ...prev,
        [name]: error,
      }));
    }
  };

  const handleBlur = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    const fieldValue = type === 'checkbox' ? checked : value;

    setTouched(prev => ({ ...prev, [name]: true }));

    const error = validateField(name, fieldValue);
    setErrors(prev => ({
      ...prev,
      [name]: error,
    }));
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Mark all fields as touched
    setTouched({
      origin: true,
      destination: true,
      weight: true,
      pickupDate: true,
    });

    if (validateForm()) {
      const requestData: IQuoteRequest = {
        origin: formData.origin,
        destination: formData.destination,
        weight: parseFloat(formData.weight),
        pickupDate: formData.pickupDate,
        fragile: formData.fragile,
      };

      onSubmit(requestData);
    }
  };

  const isFormValid = () => {
    // Check if all required fields are filled
    if (
      formData.origin.trim() === '' ||
      formData.destination.trim() === '' ||
      formData.weight === '' ||
      formData.pickupDate === ''
    ) {
      return false;
    }

    // Check weight range
    const weightNum = parseFloat(formData.weight);
    if (isNaN(weightNum) || weightNum < 0.1 || weightNum > 1000) {
      return false;
    }

    // Check for any validation errors
    if (Object.values(errors).some(error => error !== undefined)) {
      return false;
    }

    return true;
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="origin">Origen</label>
        <input
          id="origin"
          name="origin"
          type="text"
          value={formData.origin}
          onChange={handleChange}
          onBlur={handleBlur}
        />
        {touched.origin && errors.origin && (
          <span style={{ color: 'red' }}>{errors.origin}</span>
        )}
      </div>

      <div>
        <label htmlFor="destination">Destino</label>
        <input
          id="destination"
          name="destination"
          type="text"
          value={formData.destination}
          onChange={handleChange}
          onBlur={handleBlur}
        />
        {touched.destination && errors.destination && (
          <span style={{ color: 'red' }}>{errors.destination}</span>
        )}
      </div>

      <div>
        <label htmlFor="weight">Peso (kg)</label>
        <input
          id="weight"
          name="weight"
          type="number"
          step="0.1"
          value={formData.weight}
          onChange={handleChange}
          onBlur={handleBlur}
        />
        {touched.weight && errors.weight && (
          <span style={{ color: 'red' }}>{errors.weight}</span>
        )}
      </div>

      <div>
        <label htmlFor="pickupDate">Fecha de Recolección</label>
        <input
          id="pickupDate"
          name="pickupDate"
          type="date"
          value={formData.pickupDate}
          onChange={handleChange}
          onBlur={handleBlur}
        />
        {touched.pickupDate && errors.pickupDate && (
          <span style={{ color: 'red' }}>{errors.pickupDate}</span>
        )}
      </div>

      <div>
        <label htmlFor="fragile">
          <input
            id="fragile"
            name="fragile"
            type="checkbox"
            checked={formData.fragile}
            onChange={handleChange}
          />
          Frágil
        </label>
      </div>

      <button type="submit" disabled={!isFormValid()}>
        Obtener Cotizaciones
      </button>
    </form>
  );
};
