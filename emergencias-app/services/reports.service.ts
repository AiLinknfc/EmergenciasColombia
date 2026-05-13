import { supabase } from '@/lib/supabase/client'

export interface EmergencyReport {
  id: string;
  type: string;
  location: { lat: number, lng: number };
  description: string;
  status: 'active' | 'resolved' | 'duplicate';
  reporter_id?: string;
  parent_case_id?: string;
  created_at: string;
}

/**
 * Servicio para el Sistema de Reportes de Llamadas y Unificación de Casos
 */
export const reportsService = {
  /**
   * Crea un nuevo reporte de emergencia.
   * Valida si existe un caso similar activo en el mismo radio (500m) para unificación.
   */
  async createReport(report: Omit<EmergencyReport, 'id' | 'created_at' | 'status' | 'parent_case_id'>) {
    try {
      // 1. Buscar casos activos similares cerca
      const { data: nearbyCases, error: searchError } = await supabase
        .rpc('find_nearby_active_emergencies', {
          lat: report.location.lat,
          lng: report.location.lng,
          radius_meters: 500,
          emergency_type: report.type
        })

      let parentCaseId = null;
      let status = 'active';

      // Si hay un caso similar a menos de 500m del mismo tipo, lo marcamos como duplicado/unificado
      if (nearbyCases && nearbyCases.length > 0) {
        parentCaseId = nearbyCases[0].id;
        status = 'duplicate';
      }

      // 2. Insertar el reporte
      const { data, error } = await supabase
        .from('emergency_reports')
        .insert({
          ...report,
          location: `POINT(${report.location.lng} ${report.location.lat})`, // PostGIS
          status,
          parent_case_id: parentCaseId
        })
        .select()
        .single()

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error in createReport:', error);
      throw error;
    }
  },

  /**
   * Obtiene todos los incidentes activos y únicos (padres)
   */
  async getUnifiedActiveIncidents() {
    const { data, error } = await supabase
      .from('emergency_reports')
      .select('*, reports:emergency_reports(count)')
      .eq('status', 'active')
      .is('parent_case_id', null)

    if (error) throw error;
    return data;
  }
}
