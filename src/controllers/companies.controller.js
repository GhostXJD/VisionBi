import company from "../models/company.model.js";


//Crear Empresa
export const createCompany = async (req, res) => {
    const { businessRut, businessName, agent } = req.body;
    try {
        const companyFound = await company.findOne({ businessRut });
        if (companyFound)
            return res.status(404).json(['Este RUT de empresa ya existe']);

        const newCompany = new company({
            businessRut,
            businessName,
            agent
        });

        const companySaved = await newCompany.save();
        res.json({
            id: companySaved._id,
            businessRut: companySaved.businessRut,
            businessName: companySaved.businessName,
            agent: companySaved.agent
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

//Obtener una Empresa
export const getCompany = async (req, res) => {
    try {
        const companyEncontrado = await company.findById(req.params.id);
        if (!companyEncontrado) return res.status(404).json({ message: 'Compañia no encontrada' });
        res.json(companyEncontrado)
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

//Obtener todas las Empresas
export const getCompanies = async (req, res) => {
    try {
        const companies = await company.find().select('businessRut businessName agent');
        res.json(companies)
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

//Actualizar Empresa
export const updateCompany = async (req, res) => {
    try {
      const { businessRut, businessName, agent } = req.body;
      const updatedCompany = await company.findByIdAndUpdate(req.params.id, { businessRut, businessName, agent }, { new: true });
      if (!updatedCompany) {
        return res.status(404).json({ message: 'Empresa no encontrada' });
      }
      res.json(updatedCompany);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };
