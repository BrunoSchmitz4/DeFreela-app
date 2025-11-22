import { createContext, useContext, useState } from "react";
import { DeliveryRepository } from "../repos/DeliveryRepository";

const DeliveryContext = createContext();

export function DeliveryProvider({ children }) {
  const [deliveries, setDeliveries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  function response(data = null, error = null) {
    return { data, error, loading: false };
  }

  /**
   * Busca entregas de uma tarefa
   */
  async function getTaskDeliveries(taskId) {
    try {
      setLoading(true);
      setError(null);

      const list = await DeliveryRepository.getByTask(taskId);
      setDeliveries(list);

      return response(list, null);
    } catch (err) {
      setError(err);
      return response(null, err);
    } finally {
      setLoading(false);
    }
  }

  /**
   * Cria nova entrega
   */
  async function createDelivery(taskId, payload) {
    try {
      setLoading(true);
      setError(null);

      const newDelivery = await DeliveryRepository.create(taskId, payload);
      setDeliveries(prev => [...prev, newDelivery]);

      return response(newDelivery, null);
    } catch (err) {
      setError(err);
      return response(null, err);
    } finally {
      setLoading(false);
    }
  }

  /**
   * Aprova entrega
   */
  async function approveDelivery(id, aprovadorId) {
    try {
      setLoading(true);
      setError(null);

      const updated = await DeliveryRepository.approve(id, aprovadorId);
      setDeliveries(prev =>
        prev.map(d => (d.id === id ? updated : d))
      );

      return response(updated, null);
    } catch (err) {
      setError(err);
      return response(null, err);
    } finally {
      setLoading(false);
    }
  }

  /**
   * Reprova entrega
   */
  async function rejectDelivery(id, motivo) {
    try {
      setLoading(true);
      setError(null);

      const updated = await DeliveryRepository.reject(id, motivo);
      setDeliveries(prev =>
        prev.map(d => (d.id === id ? updated : d))
      );

      return response(updated, null);
    } catch (err) {
      setError(err);
      return response(null, err);
    } finally {
      setLoading(false);
    }
  }

  /**
   * Solicita revisão
   */
  async function requestRevision(id, feedback) {
    try {
      setLoading(true);
      setError(null);

      const updated = await DeliveryRepository.requestRevision(id, feedback);
      setDeliveries(prev =>
        prev.map(d => (d.id === id ? updated : d))
      );

      return response(updated, null);
    } catch (err) {
      setError(err);
      return response(null, err);
    } finally {
      setLoading(false);
    }
  }

  /**
   * Busca entregas pendentes de aprovação
   */
  async function getPendingDeliveries() {
    try {
      setLoading(true);
      setError(null);

      const list = await DeliveryRepository.getPendingApproval();
      return response(list, null);
    } catch (err) {
      setError(err);
      return response(null, err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <DeliveryContext.Provider
      value={{
        deliveries,
        loading,
        error,
        getTaskDeliveries,
        createDelivery,
        approveDelivery,
        rejectDelivery,
        requestRevision,
        getPendingDeliveries,
      }}
    >
      {children}
    </DeliveryContext.Provider>
  );
}

export function useDeliveryContext() {
  return useContext(DeliveryContext);
}