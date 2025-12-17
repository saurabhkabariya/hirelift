/**
 * Brevo (Sendinblue) API Service for HireLift
 * Manages user contacts and plan types in Brevo email marketing platform
 */

// Import Brevo SDK
import brevo from '@getbrevo/brevo';

// Initialize Brevo API client
let defaultClient;
let apiKey;
let isInitialized = false;

// Configuration
const BREVO_LIST_NAME = 'HireLift Users';
const PLAN_TYPE_ATTRIBUTE = 'PLAN_TYPE';

// Plan type mappings
export const PLAN_TYPES = {
  FREE: 'free',
  BASIC: 'basic',
  RESUME_ATS_FIX: 'resumeatsfix',
  PROFESSIONAL: 'professional',
  PREMIUM: 'premium'
};

/**
 * Initialize Brevo service with API key
 */
export function initializeBrevo() {
  if (isInitialized) {
    return; // Already initialized
  }
  
  if (!process.env.BREVO_API_KEY) {
    console.warn('⚠️ BREVO_API_KEY environment variable not found');
    return;
  }
  
  try {
    console.log('🔧 Initializing Brevo SDK v3.0.1...');
    
    // Store API key since brevo.ApiClient.instance doesn't exist in this version
    apiKey = process.env.BREVO_API_KEY;
    isInitialized = true;
    
    console.log('✅ Brevo service initialized with direct API key approach');
  } catch (error) {
    console.error('❌ Failed to initialize Brevo service:', error);
  }
}

/**
 * Ensure Brevo is initialized before API calls
 */
function ensureInitialized() {
  if (!isInitialized) {
    initializeBrevo();
  }
  
  if (!isInitialized) {
    throw new Error('Brevo service is not properly initialized. Check BREVO_API_KEY environment variable.');
  }
}

/**
 * Get or create the HireLift Users contact list
 * @returns {Promise<number>} List ID
 */
export async function getOrCreateContactList() {
  try {
    ensureInitialized();
    
    // Create API instance and set authentication
    const apiInstance = new brevo.ContactsApi();
    apiInstance.authentications.apiKey.apiKey = apiKey;
    
    // Get all contact lists with pagination parameters
    const opts = {
      limit: 50,
      offset: 0
    };
    
    const listsResponse = await apiInstance.getLists(opts);
    console.log(`🔍 Full API response:`, JSON.stringify(listsResponse, null, 2));
    
    // Find existing HireLift Users list
    // The response might be the array directly or nested in different properties
    let listArray = null;
    
    if (Array.isArray(listsResponse)) {
      listArray = listsResponse;
    } else if (listsResponse && listsResponse.lists && Array.isArray(listsResponse.lists)) {
      listArray = listsResponse.lists;
    } else if (listsResponse && listsResponse.body && listsResponse.body.lists && Array.isArray(listsResponse.body.lists)) {
      listArray = listsResponse.body.lists;
    } else if (listsResponse && listsResponse.data && Array.isArray(listsResponse.data)) {
      listArray = listsResponse.data;
    }
    
    if (listArray && Array.isArray(listArray)) {
      console.log(`📋 Found ${listArray.length} lists:`, listArray.map(l => ({ id: l.id, name: l.name })));
      
      const existingList = listArray.find(list => list.name === BREVO_LIST_NAME);
      
      if (existingList) {
        console.log(`✅ Found existing list: ${BREVO_LIST_NAME} (ID: ${existingList.id})`);
        return existingList.id;
      }
    } else {
      console.warn(`⚠️ Could not find lists array in response, full response:`, listsResponse);
    }
    
    console.log(`📋 List '${BREVO_LIST_NAME}' not found, creating new one...`);
    
    // Create new list if not exists
    const createList = new brevo.CreateList();
    createList.name = BREVO_LIST_NAME;
    createList.folderId = 1; // Default folder
    
    const newList = await apiInstance.createList(createList);
    console.log(`📋 Created new list: ${BREVO_LIST_NAME} (ID: ${newList.id})`);
    
    return newList.id;
  } catch (error) {
    console.error('❌ Error managing contact list:', error);
    console.error('Error details:', {
      message: error.message,
      status: error.status,
      response: error.response
    });
    
    // Don't create a new list on error - throw to prevent duplicate lists
    throw new Error(`Failed to get or create contact list: ${error.message}`);
  }
}

/**
 * Check if contact exists in Brevo
 * @param {string} email - Contact email
 * @returns {Promise<object|null>} Contact data or null if not found
 */
export async function getContact(email) {
  try {
    ensureInitialized();
    
    // Create API instance and set authentication
    const apiInstance = new brevo.ContactsApi();
    apiInstance.authentications.apiKey.apiKey = apiKey;
    
    const contact = await apiInstance.getContactInfo(email);
    return contact;
  } catch (error) {
    if (error.status === 404) {
      return null; // Contact not found
    }
    console.error('❌ Error getting contact:', error);
    throw error;
  }
}

/**
 * Create a new contact in Brevo or add existing contact to list
 * @param {string} email - Contact email
 * @param {string} planType - Plan type (free, basic, premium, etc.)
 * @param {string} [firstName] - Optional first name
 * @param {string} [lastName] - Optional last name
 * @param {number} [highestATSScore] - Optional highest ATS score achieved
 * @returns {Promise<object>} Created contact data
 */
export async function createContact(email, planType, firstName = '', lastName = '', highestATSScore = 0) {
  try {
    ensureInitialized();
    
    console.log(`📧 Processing Brevo contact for: ${email}`);
    
    // Create API instance and set authentication
    const apiInstance = new brevo.ContactsApi();
    apiInstance.authentications.apiKey.apiKey = apiKey;
    
    // Get the list ID - this will reuse existing list or create new one
    let listId;
    try {
      listId = await getOrCreateContactList();
      console.log(`📋 Using list ID: ${listId}`);
    } catch (listError) {
      console.error('❌ Failed to get list ID:', listError);
      console.warn('⚠️ Continuing without adding to list');
      listId = null;
    }
    
    // Check if contact already exists
    let existingContact = null;
    try {
      existingContact = await getContact(email);
      console.log(`📧 Contact already exists in Brevo:`, existingContact.email);
    } catch (error) {
      // Contact doesn't exist, that's fine
      console.log(`📧 Contact doesn't exist yet, will create new one`);
    }
    
    if (existingContact) {
      // Contact exists - just add to list and update attributes
      console.log(`📝 Updating existing contact and adding to list...`);
      
      const updateContact = new brevo.UpdateContact();
      
      // Add to list if not already in it
      if (listId) {
        const contactLists = existingContact.listIds || [];
        if (!contactLists.includes(listId)) {
          updateContact.listIds = [...contactLists, listId];
          console.log(`📋 Adding contact to list ${listId}`);
        } else {
          console.log(`📋 Contact already in list ${listId}`);
        }
      }
      
      // Update attributes (only standard ones)
      const attributes = {};
      if (firstName) attributes.FIRSTNAME = firstName;
      if (lastName) attributes.LASTNAME = lastName;
      if (planType) attributes.PLAN_TYPE = planType;
      
      updateContact.attributes = attributes;
      
      await apiInstance.updateContact(email, updateContact);
      console.log(`✅ Updated existing contact: ${email}`);
      
      return { id: existingContact.id, email };
    }
    
    // Contact doesn't exist - create new one
    const createContact = new brevo.CreateContact();
    createContact.email = email;
    
    // Only add to list if we successfully got a list ID
    if (listId) {
      createContact.listIds = [listId];
    }
    
    // Use only standard Brevo attributes (FIRSTNAME, LASTNAME)
    const attributes = {};
    if (firstName) attributes.FIRSTNAME = firstName;
    if (lastName) attributes.LASTNAME = lastName;
    if (planType) attributes.PLAN_TYPE = planType;
    
    createContact.attributes = attributes;
    
    console.log(`📝 Creating new contact in Brevo:`, {
      email,
      planType,
      listId,
      attributes: createContact.attributes
    });
    
    const result = await apiInstance.createContact(createContact);
    console.log(`✅ Created new contact: ${email} (ID: ${result.id})`);
    
    return result;
  } catch (error) {
    console.error('❌ Error processing contact:', error);
    
    // Enhanced error logging
    if (error.response) {
      console.error('Response error details:', {
        status: error.response.status,
        statusText: error.response.statusText,
        data: error.response.data
      });
    }
    
    // Don't throw to prevent signup failure
    console.warn('⚠️ Continuing signup despite Brevo error');
    return null;
  }
}

/**
 * Update existing contact attributes
 * @param {string} email - Contact email
 * @param {string} planType - New plan type
 * @param {object} [additionalAttributes] - Additional attributes to update
 * @returns {Promise<void>}
 */
export async function updateContact(email, planType, additionalAttributes = {}) {
  try {
    ensureInitialized();
    
    // Create API instance and set authentication
    const apiInstance = new brevo.ContactsApi();
    apiInstance.authentications.apiKey.apiKey = apiKey;
    
    const updateContact = new brevo.UpdateContact();
    updateContact.attributes = {
      [PLAN_TYPE_ATTRIBUTE]: planType,
      ...additionalAttributes
    };
    
    console.log(`📝 Updating contact in Brevo:`, {
      email,
      planType,
      attributes: updateContact.attributes
    });
    
    await apiInstance.updateContact(email, updateContact);
    console.log(`✅ Updated contact: ${email} to plan: ${planType}`);
    
  } catch (error) {
    console.error('❌ Error updating contact:', error);
    // Don't throw to prevent signup failure
    console.warn('⚠️ Continuing despite Brevo update error');
    return null;
  }
}

/**
 * Main function to update or create Brevo contact with plan type
 * @param {string} email - Contact email
 * @param {string} planType - Plan type (free, basic, premium, etc.)
 * @param {object} [options] - Optional parameters
 * @param {string} [options.firstName] - First name
 * @param {string} [options.lastName] - Last name
 * @param {object} [options.additionalAttributes] - Additional attributes
 * @returns {Promise<object>} Operation result
 */
export async function updateBrevoContact(email, planType, options = {}) {
  try {
    // Validate inputs
    if (!email || !planType) {
      throw new Error('Email and planType are required');
    }
    
    if (!Object.values(PLAN_TYPES).includes(planType)) {
      throw new Error(`Invalid plan type: ${planType}. Valid types: ${Object.values(PLAN_TYPES).join(', ')}`);
    }
    
    console.log(`🔄 Processing Brevo contact update for: ${email} (${planType})`);
    
    // Ensure Brevo is initialized
    ensureInitialized();
    
    try {
      // Check if contact exists by trying to get it
      const existingContact = await getContact(email);
      
      if (existingContact) {
        // Update existing contact
        await updateContact(email, planType, options.additionalAttributes);
        
        return {
          success: true,
          action: 'updated',
          email,
          planType,
          contactId: existingContact.id
        };
      }
    } catch (getError) {
      // Contact doesn't exist or error getting contact, try to create new one
      console.log(`📝 Contact not found, creating new contact for: ${email}`);
    }
    
    // Create new contact
    const newContact = await createContact(
      email, 
      planType, 
      options.firstName || '', 
      options.lastName || ''
    );
    
    // If we have additional attributes, update the contact with them
    if (options.additionalAttributes && Object.keys(options.additionalAttributes).length > 0) {
      await updateContact(email, planType, options.additionalAttributes);
    }
    
    return {
      success: true,
      action: 'created',
      email,
      planType,
      contactId: newContact.id
    };
    
  } catch (error) {
    console.error(`❌ Failed to update Brevo contact for ${email}:`, error.message);
    
    return {
      success: false,
      error: error.message,
      email,
      planType
    };
  }
}

/**
 * Get all contacts with specific plan type
 * @param {string} planType - Plan type to filter by
 * @returns {Promise<Array>} Array of contacts
 */
export async function getContactsByPlanType(planType) {
  try {
    ensureInitialized();
    
    // Create API instance and set authentication
    const apiInstance = new brevo.ContactsApi();
    apiInstance.authentications.apiKey.apiKey = apiKey;
    
    const opts = {
      limit: 500, // Maximum allowed by Brevo
      offset: 0,
      modifiedSince: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(), // Last 90 days
    };
    
    const contacts = await apiInstance.getContacts(opts);
    
    // Filter contacts by plan type
    const filteredContacts = contacts.contacts.filter(contact => 
      contact.attributes && contact.attributes[PLAN_TYPE_ATTRIBUTE] === planType
    );
    
    console.log(`📊 Found ${filteredContacts.length} contacts with plan type: ${planType}`);
    
    return filteredContacts;
  } catch (error) {
    console.error('❌ Error getting contacts by plan type:', error);
    throw error;
  }
}

/**
 * Batch update contacts from one plan type to another
 * @param {string} fromPlanType - Current plan type
 * @param {string} toPlanType - New plan type
 * @param {function} [filterFunction] - Optional filter function
 * @returns {Promise<object>} Update results
 */
export async function batchUpdatePlanType(fromPlanType, toPlanType, filterFunction = null) {
  try {
    console.log(`🔄 Starting batch update from ${fromPlanType} to ${toPlanType}`);
    
    const contacts = await getContactsByPlanType(fromPlanType);
    let updated = 0;
    let failed = 0;
    
    for (const contact of contacts) {
      try {
        // Apply filter if provided
        if (filterFunction && !filterFunction(contact)) {
          continue;
        }
        
        await updateContact(contact.email, toPlanType);
        updated++;
        
        // Add small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 100));
      } catch (error) {
        console.error(`❌ Failed to update ${contact.email}:`, error.message);
        failed++;
      }
    }
    
    const result = {
      success: true,
      fromPlanType,
      toPlanType,
      totalProcessed: contacts.length,
      updated,
      failed
    };
    
    console.log(`✅ Batch update completed:`, result);
    return result;
    
  } catch (error) {
    console.error('❌ Batch update failed:', error);
    throw error;
  }
}